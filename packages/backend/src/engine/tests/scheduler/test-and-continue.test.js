import { describe, it, expect, beforeEach } from 'vitest';
import nock from 'nock';
import Execution from '@/models/execution.js';
import { createUser } from '@/factories/user.js';
import { createConnection } from '@/factories/connection.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import { DateTime } from 'luxon';

describe.sequential('Scheduler app test and continue', () => {
  let currentUser, flow, formatterStep, ntfyStep, ntfyConnection;

  beforeEach(async () => {
    currentUser = await createUser();

    flow = await createFlow({
      userId: currentUser.id,
      name: 'Scheduler test flow',
    });

    await createStep({
      flowId: flow.id,
      type: 'trigger',
      appKey: 'scheduler',
      key: 'everyDay',
      name: 'Every day trigger',
      parameters: {
        triggersOnWeekend: true,
        hour: 7,
      },
      position: 1,
      status: 'completed',
    });

    formatterStep = await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'formatter',
      key: 'text',
      parameters: {
        input: 'good morning!',
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
        title: 'A new day!',
        topic: 'automatisch-test',
        attach: '',
        message: `{{step.${formatterStep.id}.output}}`,
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
    const now = DateTime.now();
    const todayAt7 = now.set({
      hours: 7,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const expectedDate = now < todayAt7 ? todayAt7 : todayAt7.plus({ days: 1 });

    expect(executionSteps[0].dataOut.ISO_date_time).toBe(expectedDate.toISO());
    expect(executionSteps[0].errorDetails).toBeNull();

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].dataOut).toMatchObject({
      output: 'Good Morning!',
    });
    expect(executionSteps[1].errorDetails).toBeNull();
  });

  it('should respond last execution step with success', async () => {
    nock('https://ntfy.sh').persist().post('/').reply(200, {
      id: 'GH123456789',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-test',
      title: 'A new day!',
      message: 'Good Morning!',
      priority: 3,
    });

    const testedStep = await ntfyStep.testAndContinue();

    const lastExecution = await testedStep.lastExecutionStep.$relatedQuery(
      'execution'
    );

    expect(lastExecution.status).toBe('success');
    expect(lastExecution.testRun).toBe(true);

    expect(testedStep.lastExecutionStep.status).toBe('success');
    expect(testedStep.lastExecutionStep.dataOut).toStrictEqual({
      id: 'GH123456789',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-test',
      title: 'A new day!',
      message: 'Good Morning!',
      priority: 3,
    });

    expect(testedStep.lastExecutionStep.errorDetails).toBeNull();

    const executionSteps = await lastExecution
      .$relatedQuery('executionSteps')
      .orderBy('createdAt', 'asc');

    expect(executionSteps.length).toBe(3);
    expect(executionSteps[0].status).toBe('success');

    const now = DateTime.now();
    const todayAt7 = now.set({
      hours: 7,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const expectedDate = now < todayAt7 ? todayAt7 : todayAt7.plus({ days: 1 });

    expect(executionSteps[0].dataOut.ISO_date_time).toBe(expectedDate.toISO());
    expect(executionSteps[0].errorDetails).toBeNull();

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].dataOut).toMatchObject({
      output: 'Good Morning!',
    });
    expect(executionSteps[1].errorDetails).toBeNull();
  });

  it('should create only one execution', async () => {
    nock('https://ntfy.sh').persist().post('/').reply(200, {
      id: 'GH123456789',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-test',
      title: 'A new day!',
      message: 'Good Morning!',
      priority: 3,
    });

    await ntfyStep.testAndContinue();

    const executions = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', true);

    expect(executions.length).toBe(1);
  });
});
