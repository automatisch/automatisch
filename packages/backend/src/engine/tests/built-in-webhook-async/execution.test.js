import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import nock from 'nock';
import app from '../../../app.js';
import Execution from '@/models/execution.js';
import { createUser } from '@/factories/user.js';
import { createConnection } from '@/factories/connection.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import ExecutionStep from '@/models/execution-step.js';
import appConfig from '@/config/app.js';
import User from '@/models/user.js';
import { waitFlowWorkerJobs } from '@/test/workers/flow.js';

describe.sequential('Built-in webhook app async', () => {
  let currentUser,
    flow,
    webhookAsyncStep,
    formatterStep,
    ntfyStep,
    ntfyConnection;

  beforeEach(async () => {
    currentUser = await createUser();

    flow = await createFlow({
      userId: currentUser.id,
      name: 'Built-in webhook sync test flow',
    });

    webhookAsyncStep = await createStep({
      flowId: flow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'Built-in webhook sync test trigger',
      parameters: {
        workSynchronously: false,
      },
      position: 1,
      webhookPath: `/webhooks/flows/${flow.id}`,
      status: 'completed',
    });

    formatterStep = await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'formatter',
      key: 'text',
      parameters: {
        input: `{{step.${webhookAsyncStep.id}.query.name}}`,
        transform: 'capitalize',
      },
      position: 2,
      status: 'completed',
    });

    ntfyConnection = await createConnection({
      userId: currentUser.id,
      key: 'ntfy',
      formattedData: {
        serverUrl: 'https://ntfy.sh',
        screenName: 'ntfy-test-connection',
      },
    });

    ntfyStep = await createStep({
      flowId: flow.id,
      connectionId: ntfyConnection.id,
      type: 'action',
      appKey: 'ntfy',
      key: 'sendMessage',
      parameters: {
        tags: [],
        click: '',
        delay: '',
        email: '',
        title: '',
        topic: 'automatisch-test',
        attach: '',
        message: `Hey {{step.${formatterStep.id}.output}}, welcome to the party!`,
        filename: '',
        priority: 3,
      },
      position: 3,
      status: 'completed',
    });

    await flow.updateStatus(true);
  });

  it('should respond with 204 status code without waiting for the flow to be completed', async () => {
    const timeBeforeTheRequest = new Date();

    const response = await request(app).get(
      `${webhookAsyncStep.webhookPath}?name=automatisch`
    );

    expect(response.status).toBe(204);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('createdAt', '>', timeBeforeTheRequest.toISOString())
      .first();

    expect(execution).toBeUndefined();

    await waitFlowWorkerJobs(flow.id);

    const createdExecution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('createdAt', '>', timeBeforeTheRequest.toISOString())
      .first();

    expect(createdExecution).toBeDefined();
  });

  it('should create executions', async () => {
    const timeBeforeTheRequest = new Date();

    nock('https://ntfy.sh').post('/').reply(200, {
      id: 'V63mhF65S68a',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-test',
      message: 'Hey Automatisch, welcome to the party!',
      priority: 3,
    });

    await request(app).get(`${webhookAsyncStep.webhookPath}?name=automatisch`);

    await waitFlowWorkerJobs(flow.id);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforeTheRequest.toISOString())
      .first();

    expect(execution).toBeDefined();
  });

  it('should create execution steps', async () => {
    const timeBeforeTheRequest = new Date();

    nock('https://ntfy.sh').post('/').reply(200, {
      id: 'V63mhF65S68a',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-test',
      message: 'Hey Automatisch, welcome to the party!',
      priority: 3,
    });

    await request(app).get(`${webhookAsyncStep.webhookPath}?name=automatisch`);

    await waitFlowWorkerJobs(flow.id);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforeTheRequest.toISOString())
      .first();

    const executionSteps = await ExecutionStep.query()
      .where('executionId', execution.id)
      .whereIn('stepId', [webhookAsyncStep.id, formatterStep.id, ntfyStep.id])
      .orderBy('createdAt', 'asc');

    expect(executionSteps.length).toBe(3);

    expect(executionSteps[0].status).toBe('success');
    expect(executionSteps[0].stepId).toBe(webhookAsyncStep.id);
    expect(executionSteps[0].dataIn).toStrictEqual({
      workSynchronously: false,
    });
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
    expect(executionSteps[1].stepId).toBe(formatterStep.id);
    expect(executionSteps[1].dataIn).toMatchObject({
      input: 'automatisch',
      transform: 'capitalize',
    });
    expect(executionSteps[1].dataOut).toMatchObject({
      output: 'Automatisch',
    });

    expect(executionSteps[2].status).toBe('success');
    expect(executionSteps[2].stepId).toBe(ntfyStep.id);
    expect(executionSteps[2].dataIn).toMatchObject({
      attach: '',
      click: '',
      delay: '',
      email: '',
      filename: '',
      message: 'Hey Automatisch, welcome to the party!',
      priority: 3,
      tags: [],
      title: '',
      topic: 'automatisch-test',
    });
    expect(executionSteps[2].dataOut).toMatchObject({
      id: 'V63mhF65S68a',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-test',
      message: 'Hey Automatisch, welcome to the party!',
      priority: 3,
    });
  });

  it('should respond with 422 if it is cloud and quota is exceeded', async () => {
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
    vi.spyOn(User.prototype, 'isAllowedToRunFlows').mockResolvedValue(false);

    const timeBeforeTheRequest = new Date();

    const response = await request(app).get(
      `${webhookAsyncStep.webhookPath}?name=automatisch`
    );

    expect(response.status).toBe(422);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('createdAt', '>', timeBeforeTheRequest.toISOString())
      .first();

    expect(execution).toBeUndefined();
  });
});
