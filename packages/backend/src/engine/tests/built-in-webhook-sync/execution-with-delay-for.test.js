import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../../app.js';
import Execution from '@/models/execution.js';
import { createUser } from '@/factories/user.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import ExecutionStep from '@/models/execution-step.js';
import appConfig from '@/config/app.js';
import User from '@/models/user.js';

describe.sequential('Built-in webhook app sync with delay for', () => {
  let currentUser,
    flow,
    webhookSyncStep,
    delayStep,
    formatterStep,
    respondWithStep;

  beforeEach(async () => {
    currentUser = await createUser();

    flow = await createFlow({
      userId: currentUser.id,
      name: 'Built-in webhook sync test flow',
    });

    webhookSyncStep = await createStep({
      flowId: flow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'Built-in webhook sync test trigger',
      parameters: {
        workSynchronously: true,
      },
      position: 1,
      webhookPath: `/webhooks/flows/${flow.id}/sync`,
      status: 'completed',
    });

    delayStep = await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'delay',
      key: 'delayFor',
      parameters: {
        delayForUnit: 'hours',
        delayForValue: '1',
      },
      position: 2,
      status: 'completed',
    });

    formatterStep = await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'formatter',
      key: 'text',
      parameters: {
        input: `{{step.${webhookSyncStep.id}.query.name}}`,
        transform: 'capitalize',
      },
      position: 3,
      status: 'completed',
    });

    respondWithStep = await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'webhook',
      key: 'respondWith',
      parameters: {
        body: `Hey {{step.${formatterStep.id}.output}}, welcome to the party!`,
        headers: [
          {
            key: 'sample-header-one',
            value: 'sample-value-one',
          },
          {
            key: 'sample-header-two',
            value: 'sample-value-two',
          },
        ],
        statusCode: '422',
      },
      position: 4,
      status: 'completed',
    });

    await flow.updateStatus(true);
  });

  it('should respond with status code, body and headers specified in the respond with action', async () => {
    const response = await request(app).get(
      `${webhookSyncStep.webhookPath}?name=automatisch`
    );

    expect(response.status).toBe(422);
    expect(response.text).toBe('Hey Automatisch, welcome to the party!');
    expect(response.headers['sample-header-one']).toBe('sample-value-one');
    expect(response.headers['sample-header-two']).toBe('sample-value-two');
  });

  it('should create executions', async () => {
    const timeBeforeTheRequest = new Date();

    await request(app).get(`${webhookSyncStep.webhookPath}?name=automatisch`);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforeTheRequest.toISOString())
      .first();

    expect(execution).toBeDefined();
  });

  it('should create all execution steps without waiting for "delay for" step', async () => {
    const timeBeforeTheRequest = new Date();

    await request(app).get(`${webhookSyncStep.webhookPath}?name=automatisch`);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforeTheRequest.toISOString())
      .first();

    const executionSteps = await ExecutionStep.query()
      .where('executionId', execution.id)
      .whereIn('stepId', [
        webhookSyncStep.id,
        delayStep.id,
        formatterStep.id,
        respondWithStep.id,
      ])
      .orderBy('createdAt', 'asc');

    expect(executionSteps.length).toBe(4);

    expect(executionSteps[0].status).toBe('success');
    expect(executionSteps[0].stepId).toBe(webhookSyncStep.id);
    expect(executionSteps[0].dataIn).toStrictEqual({ workSynchronously: true });
    expect(executionSteps[0].dataOut).toMatchObject({
      body: {},
      headers: {
        'accept-encoding': 'gzip, deflate',
        connection: 'close',
      },
      query: {
        name: 'automatisch',
      },
    });

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].stepId).toBe(delayStep.id);
    expect(executionSteps[1].dataIn).toMatchObject({
      delayForUnit: 'hours',
      delayForValue: '1',
    });
    expect(executionSteps[1].dataOut).toMatchObject({
      delayForUnit: 'hours',
      delayForValue: '1',
    });

    expect(executionSteps[2].status).toBe('success');
    expect(executionSteps[2].stepId).toBe(formatterStep.id);
    expect(executionSteps[2].dataIn).toMatchObject({
      input: 'automatisch',
      transform: 'capitalize',
    });
    expect(executionSteps[2].dataOut).toMatchObject({
      output: 'Automatisch',
    });

    expect(executionSteps[3].status).toBe('success');
    expect(executionSteps[3].stepId).toBe(respondWithStep.id);
    expect(executionSteps[3].dataIn).toMatchObject({
      body: 'Hey Automatisch, welcome to the party!',
      headers: [
        {
          key: 'sample-header-one',
          value: 'sample-value-one',
        },
        {
          key: 'sample-header-two',
          value: 'sample-value-two',
        },
      ],
      statusCode: '422',
    });
    expect(executionSteps[3].dataOut).toMatchObject({
      body: 'Hey Automatisch, welcome to the party!',
      headers: {
        'sample-header-one': 'sample-value-one',
        'sample-header-two': 'sample-value-two',
      },
    });
  });

  it('should respond with 422 if it is cloud and quota is exceeded', async () => {
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
    vi.spyOn(User.prototype, 'isAllowedToRunFlows').mockResolvedValue(false);

    const timeBeforeTheRequest = new Date();

    const response = await request(app).get(
      `${webhookSyncStep.webhookPath}?name=automatisch`
    );

    expect(response.status).toBe(422);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('createdAt', '>', timeBeforeTheRequest.toISOString())
      .first();

    expect(execution).toBeUndefined();
  });
});
