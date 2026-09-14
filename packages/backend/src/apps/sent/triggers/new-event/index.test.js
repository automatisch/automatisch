import { describe, it, expect } from 'vitest';
import nock from 'nock';
import newEvent from './index.js';
import AlreadyProcessedError from '@/errors/already-processed.js';
import EarlyExitError from '@/errors/early-exit.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import { createExecution } from '@/factories/execution.js';
import { createExecutionStep } from '@/factories/execution-step.js';
import {
  deliveredMessageEvent,
  envelope,
  inboundMessageEvent,
  SENT_API_URL,
  TEST_API_KEY,
  templateEvent,
  webhook,
} from '@/mocks/apps/sent/index.js';

const build = async ({
  stepParameters,
  request,
  testRun = false,
  executions = [],
} = {}) => {
  const flow = await createFlow();
  const step = await createStep({
    flowId: flow.id,
    type: 'trigger',
    appKey: 'sent',
    key: 'newEvent',
    parameters: stepParameters || { eventTypes: [{ eventType: 'message' }] },
  });

  for (const internalId of executions) {
    await createExecution({ flowId: flow.id, internalId });
  }

  return createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    flow,
    step,
    request,
    testRun,
  });
};

describe('Sent new event trigger', () => {
  it('is a webhook trigger with a repeatable event type selector', () => {
    expect(newEvent.type).toBe('webhook');
    expect(newEvent.arguments.map((argument) => argument.key)).toEqual([
      'senderProfileId',
      'eventTypes',
    ]);
    expect(newEvent.arguments[1].type).toBe('dynamic');
    expect(newEvent.arguments[1].fields[0].options.length).toBe(12);
  });

  it('pushes the delivered event with a stable internal id', async () => {
    const { $ } = await build({
      request: { body: deliveredMessageEvent, headers: {}, query: {} },
    });

    await newEvent.run($);

    expect($.triggerOutput.data).toEqual([
      {
        raw: deliveredMessageEvent,
        meta: {
          internalId: 'message:8ba7b830-9dad-11d1-80b4-00c04fd430c8:DELIVERED',
        },
      },
    ]);
  });

  it('skips an exact duplicate delivery of the same event', async () => {
    const { $ } = await build({
      request: { body: deliveredMessageEvent, headers: {}, query: {} },
      executions: ['message:8ba7b830-9dad-11d1-80b4-00c04fd430c8:DELIVERED'],
    });

    await expect(newEvent.run($)).rejects.toThrow(AlreadyProcessedError);
    expect($.triggerOutput.data).toEqual([]);
  });

  it('still runs for a new lifecycle state of the same message', async () => {
    const readEvent = {
      ...deliveredMessageEvent,
      event: 'message.read',
      payload: { ...deliveredMessageEvent.payload, message_status: 'READ' },
    };
    const { $ } = await build({
      request: { body: readEvent, headers: {}, query: {} },
      executions: ['message:8ba7b830-9dad-11d1-80b4-00c04fd430c8:DELIVERED'],
    });

    await newEvent.run($);

    expect($.triggerOutput.data[0].meta.internalId).toBe(
      'message:8ba7b830-9dad-11d1-80b4-00c04fd430c8:READ'
    );
  });

  it('skips duplicate inbound and template events', async () => {
    const inbound = await build({
      request: { body: inboundMessageEvent, headers: {}, query: {} },
      executions: ['message.received:6ba7b810-9dad-11d1-80b4-00c04fd430c8'],
    });

    await expect(newEvent.run(inbound.$)).rejects.toThrow(
      AlreadyProcessedError
    );

    const template = await build({
      request: { body: templateEvent, headers: {}, query: {} },
      executions: ['templates:9ba7b840-9dad-11d1-80b4-00c04fd430c8:APPROVED'],
    });

    await expect(newEvent.run(template.$)).rejects.toThrow(
      AlreadyProcessedError
    );

    const rejected = await build({
      request: {
        body: {
          ...templateEvent,
          payload: { ...templateEvent.payload, status: 'REJECTED' },
        },
        headers: {},
        query: {},
      },
      executions: ['templates:9ba7b840-9dad-11d1-80b4-00c04fd430c8:APPROVED'],
    });

    await newEvent.run(rejected.$);

    expect(rejected.$.triggerOutput.data).toHaveLength(1);
  });

  it('replays the last received event in test mode', async () => {
    const { $, step } = await build({ testRun: true });
    const execution = await createExecution({
      flowId: step.flowId,
      testRun: true,
    });

    await createExecutionStep({
      executionId: execution.id,
      stepId: step.id,
      dataOut: inboundMessageEvent,
    });

    await expect(newEvent.testRun($)).rejects.toThrow(EarlyExitError);
    expect($.triggerOutput.data[0].raw).toEqual(inboundMessageEvent);
  });

  it('uses a sample event in test mode before any delivery', async () => {
    const { $ } = await build({ testRun: true });

    await expect(newEvent.testRun($)).rejects.toThrow(EarlyExitError);
    expect($.triggerOutput.data[0].raw.event).toBe('message.delivered');
    expect($.triggerOutput.data[0].raw.payload.message_status).toBe(
      'DELIVERED'
    );
  });

  it('registers a webhook for the selected events', async () => {
    const { $ } = await build({
      stepParameters: {
        eventTypes: [
          { eventType: 'message.delivered' },
          { eventType: 'templates' },
        ],
      },
    });

    let body;

    nock(SENT_API_URL)
      .post('/v3/webhooks', (requestBody) => {
        body = requestBody;
        return true;
      })
      .reply(201, envelope(webhook()));

    await newEvent.registerHook($);

    expect(body.event_types).toEqual(['message', 'templates']);
    expect(body.event_filters).toEqual({ message: ['delivered'] });
    expect(body.endpoint_url).toBe($.webhookUrl);
  });

  it('refuses to register without any event type', async () => {
    const { $ } = await build({ stepParameters: { eventTypes: [] } });
    const scope = nock(SENT_API_URL)
      .post('/v3/webhooks')
      .reply(201, envelope(webhook()));

    await expect(newEvent.registerHook($)).rejects.toThrow(
      'Select at least one Sent event type.'
    );
    expect(scope.isDone()).toBe(false);
  });

  it('unregisters the webhook', async () => {
    const { $ } = await build();

    nock(SENT_API_URL).post('/v3/webhooks').reply(201, envelope(webhook()));
    await newEvent.registerHook($);

    const scope = nock(SENT_API_URL)
      .delete(`/v3/webhooks/${webhook().id}`)
      .reply(204);
    await newEvent.unregisterHook($);

    expect(scope.isDone()).toBe(true);
  });
});
