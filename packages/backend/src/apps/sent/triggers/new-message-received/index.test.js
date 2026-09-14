import { describe, it, expect } from 'vitest';
import nock from 'nock';
import newMessageReceived from './index.js';
import AlreadyProcessedError from '@/errors/already-processed.js';
import EarlyExitError from '@/errors/early-exit.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import { createExecution } from '@/factories/execution.js';
import {
  deliveredMessageEvent,
  envelope,
  inboundMessageEvent,
  SENT_API_URL,
  TEST_API_KEY,
  webhook,
} from '@/mocks/apps/sent/index.js';

const build = async ({ request, testRun = false, executions = [] } = {}) => {
  const flow = await createFlow();
  const step = await createStep({
    flowId: flow.id,
    type: 'trigger',
    appKey: 'sent',
    key: 'newMessageReceived',
    parameters: {},
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

describe('Sent new message received trigger', () => {
  it('pushes inbound messages with the sender, destination, text and channel', async () => {
    const { $ } = await build({
      request: { body: inboundMessageEvent, headers: {}, query: {} },
    });

    await newMessageReceived.run($);

    const [item] = $.triggerOutput.data;

    expect(item.meta.internalId).toBe(
      'message.received:6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    );
    expect(item.raw.payload).toMatchObject({
      inbound_number: '+14155550100',
      outbound_number: '+14155550101',
      text: 'Hello, I have a question about my order',
      channel: 'sms',
      message_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      received_at: '2026-01-15T10:10:40Z',
      account_id: '7ba7b820-9dad-11d1-80b4-00c04fd430c8',
    });
    expect(item.raw).toEqual(inboundMessageEvent);
  });

  it('ignores events that are not inbound messages', async () => {
    const { $ } = await build({
      request: { body: deliveredMessageEvent, headers: {}, query: {} },
    });

    await newMessageReceived.run($);

    expect($.triggerOutput.data).toEqual([]);
  });

  it('runs once when Sent retries the same inbound message', async () => {
    const { $ } = await build({
      request: { body: inboundMessageEvent, headers: {}, query: {} },
      executions: ['message.received:6ba7b810-9dad-11d1-80b4-00c04fd430c8'],
    });

    await expect(newMessageReceived.run($)).rejects.toThrow(
      AlreadyProcessedError
    );
  });

  it('uses a sample inbound message in test mode before any delivery', async () => {
    const { $ } = await build({ testRun: true });

    await expect(newMessageReceived.testRun($)).rejects.toThrow(EarlyExitError);
    expect($.triggerOutput.data[0].raw.event).toBe('message.received');
  });

  it('subscribes only to received messages', async () => {
    const { $ } = await build();

    let body;

    nock(SENT_API_URL)
      .post('/v3/webhooks', (requestBody) => {
        body = requestBody;
        return true;
      })
      .reply(201, envelope(webhook()));

    await newMessageReceived.registerHook($);

    expect(body.event_types).toEqual(['message']);
    expect(body.event_filters).toEqual({ message: ['received'] });
  });
});
