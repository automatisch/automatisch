import { vi, describe, it, expect, beforeEach } from 'vitest';
import nock from 'nock';
import Execution from '@/models/execution.js';
import Engine from '@/engine/index.js';
import { DateTime } from 'luxon';
import { createUser } from '@/factories/user.js';
import { createConnection } from '@/factories/connection.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import ExecutionStep from '@/models/execution-step.js';
import { runFlowWorkerJobs } from '@/test/workers/flow.js';
import appConfig from '@/config/app.js';
import User from '@/models/user.js';

describe.sequential('Scheduler app async', () => {
  let currentUser,
    flow,
    schedulerTriggerStep,
    formatterStep,
    ntfyStep,
    ntfyConnection,
    delayStep;

  beforeEach(async () => {
    currentUser = await createUser();

    flow = await createFlow({
      userId: currentUser.id,
      name: 'Scheduler test flow',
    });

    schedulerTriggerStep = await createStep({
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

    delayStep = await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'delay',
      key: 'delayUntil',
      parameters: {
        delayUntil: '2030-12-18',
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
        input: 'good morning!',
        transform: 'capitalize',
      },
      position: 3,
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

    await flow.updateStatus(true);

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
  });

  it('should create executions', async () => {
    const timeBeforeTheRequest = new Date();

    await runFlowWorkerJobs(flow.id);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforeTheRequest.toISOString())
      .first();

    expect(execution).toBeDefined();
  });

  it('should create execution steps until "delay until" step', async () => {
    const timeBeforeTheRequest = new Date();

    await runFlowWorkerJobs(flow.id);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforeTheRequest.toISOString())
      .first();

    const executionSteps = await ExecutionStep.query()
      .where('executionId', execution.id)
      .whereIn('stepId', [
        schedulerTriggerStep.id,
        delayStep.id,
        formatterStep.id,
        ntfyStep.id,
      ])
      .orderBy('createdAt', 'asc');

    expect(executionSteps.length).toBe(2);

    expect(executionSteps[0].status).toBe('success');
    expect(executionSteps[0].stepId).toBe(schedulerTriggerStep.id);
    expect(executionSteps[0].dataIn).toStrictEqual({
      hour: 7,
      triggersOnWeekend: true,
    });
    expect(executionSteps[0].dataOut.ISO_date_time).toBeDefined();

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].stepId).toBe(delayStep.id);
    expect(executionSteps[1].dataIn).toMatchObject({
      delayUntil: '2030-12-18',
    });
    expect(executionSteps[1].dataOut).toMatchObject({
      delayUntil: '2030-12-18',
    });
  });

  it('should delay and continue running from where it is left in background after delay', async () => {
    const timeBeforePolling = new Date();

    const runInBackgroundSpy = vi.spyOn(Engine, 'runInBackground');

    // Wait for the initial job to be processed which was created by the scheduler trigger step
    await runFlowWorkerJobs(flow.id);

    // Wait for the delayed job to be processed which was created by the worker upon the initial job
    await runFlowWorkerJobs(flow.id);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforePolling.toISOString())
      .first();

    const runInBackgrounSpyCallDelay =
      runInBackgroundSpy.mock.calls[0][0].delay;

    const expectedDelayStartRange = DateTime.fromISO('2030-12-18', {
      zone: 'utc',
    })
      .minus({ minutes: 5 })
      .diff(DateTime.now().toUTC())
      .toMillis();

    const expectedDelayEndRange = DateTime.fromISO('2030-12-18', {
      zone: 'utc',
    })
      .plus({ minutes: 5 })
      .diff(DateTime.now().toUTC())
      .toMillis();

    expect(runInBackgrounSpyCallDelay).toBeGreaterThanOrEqual(
      expectedDelayStartRange
    );
    expect(runInBackgrounSpyCallDelay).toBeLessThanOrEqual(
      expectedDelayEndRange
    );

    expect(Engine.runInBackground).toHaveBeenCalledWith(
      expect.objectContaining({
        flowId: flow.id,
        resumeStepId: formatterStep.id,
        resumeExecutionId: execution.id,
      })
    );
  });

  it('should create all execution steps after "delay until" step', async () => {
    // Wait for the initial job to be processed which was created by the async webhook
    await runFlowWorkerJobs(flow.id);

    // Wait for the delayed job to be processed which was created by the worker upon the initial job
    await runFlowWorkerJobs(flow.id, 'resume-flow');

    const executions = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false);

    expect(executions.length).toBe(1);

    const execution = executions[0];

    const executionSteps = await ExecutionStep.query()
      .where('executionId', execution.id)
      .whereIn('stepId', [
        schedulerTriggerStep.id,
        delayStep.id,
        formatterStep.id,
        ntfyStep.id,
      ])
      .orderBy('createdAt', 'asc');

    expect(executionSteps.length).toBe(4);

    expect(executionSteps[0].status).toBe('success');
    expect(executionSteps[0].stepId).toBe(schedulerTriggerStep.id);
    expect(executionSteps[0].dataIn).toStrictEqual({
      hour: 7,
      triggersOnWeekend: true,
    });
    expect(executionSteps[0].dataOut.ISO_date_time).toBeDefined();

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].stepId).toBe(delayStep.id);
    expect(executionSteps[1].dataIn).toMatchObject({
      delayUntil: '2030-12-18',
    });
    expect(executionSteps[1].dataOut).toMatchObject({
      delayUntil: '2030-12-18',
    });

    expect(executionSteps[2].status).toBe('success');
    expect(executionSteps[2].stepId).toBe(formatterStep.id);
    expect(executionSteps[2].dataIn).toMatchObject({
      input: 'good morning!',
      transform: 'capitalize',
    });
    expect(executionSteps[2].dataOut).toMatchObject({
      output: 'Good Morning!',
    });

    expect(executionSteps[3].status).toBe('success');
    expect(executionSteps[3].stepId).toBe(ntfyStep.id);

    expect(executionSteps[3].dataIn).toMatchObject({
      attach: '',
      click: '',
      delay: '',
      email: '',
      filename: '',
      message: 'Good Morning!',
      priority: 3,
      tags: [],
      title: 'A new day!',
      topic: 'automatisch-test',
    });

    expect(executionSteps[3].dataOut).toMatchObject({
      id: 'GH123456789',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-test',
      message: 'Good Morning!',
      priority: 3,
    });
  });

  it('should respond with 422 if it is cloud and quota is exceeded', async () => {
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
    vi.spyOn(User.prototype, 'isAllowedToRunFlows').mockResolvedValue(false);

    await runFlowWorkerJobs(flow.id);

    const execution = await Execution.query().where('flowId', flow.id).first();

    expect(execution).toBeUndefined();
  });
});
