import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import nock from 'nock';
import app from '../../../app.js';
import Execution from '@/models/execution.js';
import { createUser } from '@/factories/user.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import { createConnection } from '@/factories/connection.js';

describe.sequential('Built-in webhook sync test and continue', () => {
  let currentUser,
    flow,
    webhookSyncStep,
    formatterStep,
    ntfyConnection,
    ntfyStep;

  beforeEach(async () => {
    currentUser = await createUser();

    flow = await createFlow({
      userId: currentUser.id,
      name: 'Test and continue flow',
    });

    webhookSyncStep = await createStep({
      flowId: flow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'Built-in webhook sync test trigger',
      parameters: {
        workSynchronously: false,
      },
      position: 1,
      webhookPath: `/webhooks/flows/${flow.id}/sync`,
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
      position: 4,
      status: 'completed',
    });
  });

  it('should respond last execution step with error', async () => {
    nock('https://ntfy.sh').post('/').reply(400, {
      code: 40009,
      http: 400,
      error: 'invalid request: topic invalid',
    });

    await request(app).get(`${webhookSyncStep.webhookPath}?name=automatisch`);

    const testedStep = await ntfyStep.testAndContinue();

    const lastExecution = await testedStep.lastExecutionStep.$relatedQuery(
      'execution'
    );

    expect(lastExecution.status).toBe('failure');
    expect(lastExecution.testRun).toBe(true);

    expect(testedStep.lastExecutionStep.status).toBe('failure');
    expect(testedStep.lastExecutionStep.dataOut).toBeNull();

    expect(testedStep.lastExecutionStep.errorDetails).toStrictEqual({
      code: 40009,
      http: 400,
      error: 'invalid request: topic invalid',
    });

    const executionSteps = await lastExecution
      .$relatedQuery('executionSteps')
      .orderBy('createdAt', 'asc');

    expect(executionSteps.length).toBe(3);
    expect(executionSteps[0].status).toBe('success');
    expect(executionSteps[0].dataOut).toMatchObject({
      query: {
        name: 'automatisch',
      },
    });
    expect(executionSteps[0].errorDetails).toBeNull();

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].dataOut).toMatchObject({
      output: 'Automatisch',
    });
    expect(executionSteps[1].errorDetails).toBeNull();
  });

  it('should respond last execution step with success', async () => {
    nock('https://ntfy.sh').post('/').reply(200, {
      id: 'V63mhF65S68a',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-test',
      message: 'Hey Automatisch, welcome to the party!',
      priority: 3,
    });

    await request(app).get(`${webhookSyncStep.webhookPath}?name=automatisch`);

    const testedStep = await ntfyStep.testAndContinue();

    const lastExecution = await testedStep.lastExecutionStep.$relatedQuery(
      'execution'
    );

    expect(lastExecution.status).toBe('success');
    expect(lastExecution.testRun).toBe(true);

    expect(testedStep.lastExecutionStep.status).toBe('success');
    expect(testedStep.lastExecutionStep.dataOut).toStrictEqual({
      event: 'message',
      expires: 1755322502,
      id: 'V63mhF65S68a',
      message: 'Hey Automatisch, welcome to the party!',
      priority: 3,
      time: 1755279302,
      topic: 'automatisch-test',
    });

    expect(testedStep.lastExecutionStep.errorDetails).toBeNull();

    const executionSteps = await lastExecution
      .$relatedQuery('executionSteps')
      .orderBy('createdAt', 'asc');

    expect(executionSteps.length).toBe(3);
    expect(executionSteps[0].status).toBe('success');
    expect(executionSteps[0].dataOut).toMatchObject({
      query: {
        name: 'automatisch',
      },
    });
    expect(executionSteps[0].errorDetails).toBeNull();

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].dataOut).toMatchObject({
      output: 'Automatisch',
    });
    expect(executionSteps[1].errorDetails).toBeNull();
  });

  it('should create only one execution', async () => {
    nock('https://ntfy.sh').post('/').reply(200, {
      id: 'V63mhF65S68a',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-test',
      message: 'Hey Automatisch, welcome to the party!',
      priority: 3,
    });

    await request(app).get(`${webhookSyncStep.webhookPath}?name=automatisch`);

    const timeBeforeTestAndContinueClick = new Date();

    await ntfyStep.testAndContinue();

    const executions = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', true)
      .andWhere('createdAt', '>', timeBeforeTestAndContinueClick.toISOString());

    expect(executions.length).toBe(1);
  });
});
