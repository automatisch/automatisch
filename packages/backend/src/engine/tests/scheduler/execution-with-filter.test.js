import { vi, describe, it, expect, beforeEach } from 'vitest';
import nock from 'nock';
import Execution from '@/models/execution.js';
import Engine from '@/engine/index.js';
import { createUser } from '@/factories/user.js';
import { createConnection } from '@/factories/connection.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import ExecutionStep from '@/models/execution-step.js';
import { runFlowWorkerJobs } from '@/test/workers/flow.js';
import appConfig from '@/config/app.js';
import User from '@/models/user.js';

describe.sequential('Scheduler app with filter', () => {
  let currentUser,
    flow,
    schedulerTriggerStep,
    formatterStep,
    filterStep,
    ntfyStep,
    ntfyConnection,
    runInBackgroundSpy;

  beforeEach(async () => {
    runInBackgroundSpy = vi.spyOn(Engine, 'runInBackground');

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

    filterStep = await createStep({
      flowId: flow.id,
      type: 'action',
      appKey: 'filter',
      key: 'continueIfMatches',
      parameters: {
        or: [
          {
            and: [
              {
                key: 'A',
                operator: 'equal',
                value: 'A',
              },
            ],
          },
        ],
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

  it('should schedule running at specified interval', async () => {
    expect(runInBackgroundSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        flowId: flow.id,
        jobId: flow.id,
        repeat: {
          pattern: '0 7 * * *',
        },
      })
    );
  });

  it('should create execution', async () => {
    await runFlowWorkerJobs(flow.id);

    const executions = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false);

    expect(executions).toBeDefined();
    expect(executions.length).toBe(1);
  });

  it('should create 4 execution steps when filter is matched', async () => {
    await runFlowWorkerJobs(flow.id);

    const executions = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false);

    const executionSteps = await ExecutionStep.query()
      .whereIn(
        'executionId',
        executions.map((execution) => execution.id)
      )
      .whereIn('stepId', [
        schedulerTriggerStep.id,
        formatterStep.id,
        filterStep.id,
        ntfyStep.id,
      ]);

    expect(executionSteps).toBeDefined();
    expect(executionSteps.length).toBe(4);
  });

  it('should create 3 execution steps when filter is not matched', async () => {
    await filterStep.$query().patch({
      parameters: {
        or: [
          {
            and: [
              {
                key: 'A',
                operator: 'equal',
                value: 'B',
              },
            ],
          },
        ],
      },
    });

    await runFlowWorkerJobs(flow.id);

    const executions = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false);

    const executionSteps = await ExecutionStep.query()
      .whereIn(
        'executionId',
        executions.map((execution) => execution.id)
      )
      .whereIn('stepId', [
        schedulerTriggerStep.id,
        formatterStep.id,
        filterStep.id,
        ntfyStep.id,
      ]);

    expect(executionSteps).toBeDefined();
    expect(executionSteps.length).toBe(3);
  });

  it('should create execution steps with correct data when filter is matched', async () => {
    await runFlowWorkerJobs(flow.id);

    const lastExecution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .orderBy('createdAt', 'desc')
      .first();

    const executionSteps = await ExecutionStep.query()
      .where('executionId', lastExecution.id)
      .whereIn('stepId', [
        schedulerTriggerStep.id,
        formatterStep.id,
        filterStep.id,
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
    expect(executionSteps[1].stepId).toBe(formatterStep.id);

    expect(executionSteps[1].dataIn).toMatchObject({
      input: 'good morning!',
      transform: 'capitalize',
    });

    expect(executionSteps[1].dataOut).toMatchObject({
      output: 'Good Morning!',
    });

    expect(executionSteps[2].status).toBe('success');
    expect(executionSteps[2].stepId).toBe(filterStep.id);

    expect(executionSteps[2].dataIn).toMatchObject({
      or: [
        {
          and: [
            {
              key: 'A',
              operator: 'equal',
              value: 'A',
            },
          ],
        },
      ],
    });

    expect(executionSteps[2].dataOut).toMatchObject({
      or: [
        {
          and: [
            {
              key: 'A',
              operator: 'equal',
              value: 'A',
            },
          ],
        },
      ],
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
      title: 'A new day!',
      message: 'Good Morning!',
      priority: 3,
    });
  });

  it('should create execution steps with correct data when filter is not matched', async () => {
    await filterStep.$query().patch({
      parameters: {
        or: [
          {
            and: [
              {
                key: 'A',
                operator: 'equal',
                value: 'B',
              },
            ],
          },
        ],
      },
    });

    await runFlowWorkerJobs(flow.id);

    const lastExecution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .orderBy('createdAt', 'desc')
      .first();

    const executionSteps = await ExecutionStep.query()
      .where('executionId', lastExecution.id)
      .whereIn('stepId', [
        schedulerTriggerStep.id,
        formatterStep.id,
        filterStep.id,
        ntfyStep.id,
      ])
      .orderBy('createdAt', 'asc');

    expect(executionSteps.length).toBe(3);

    expect(executionSteps[0].status).toBe('success');
    expect(executionSteps[0].stepId).toBe(schedulerTriggerStep.id);

    expect(executionSteps[0].dataIn).toStrictEqual({
      hour: 7,
      triggersOnWeekend: true,
    });

    expect(executionSteps[0].dataOut.ISO_date_time).toBeDefined();

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].stepId).toBe(formatterStep.id);

    expect(executionSteps[1].dataIn).toMatchObject({
      input: 'good morning!',
      transform: 'capitalize',
    });

    expect(executionSteps[1].dataOut).toMatchObject({
      output: 'Good Morning!',
    });

    expect(executionSteps[2].status).toBe('success');
    expect(executionSteps[2].stepId).toBe(filterStep.id);

    expect(executionSteps[2].dataIn).toMatchObject({
      or: [
        {
          and: [
            {
              key: 'A',
              operator: 'equal',
              value: 'B',
            },
          ],
        },
      ],
    });

    expect(executionSteps[2].dataOut).toBeNull();
  });

  it('should not create execution if cloud quota is exceeded', async () => {
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
    vi.spyOn(User.prototype, 'isAllowedToRunFlows').mockResolvedValue(false);

    await runFlowWorkerJobs(flow.id);

    const execution = await Execution.query().where('flowId', flow.id).first();

    expect(execution).toBeUndefined();
  });
});
