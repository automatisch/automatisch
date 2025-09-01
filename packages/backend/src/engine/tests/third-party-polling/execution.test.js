import { vi, describe, it, expect, beforeEach } from 'vitest';
import nock from 'nock';
import Execution from '@/models/execution.js';
import { createUser } from '@/factories/user.js';
import { createConnection } from '@/factories/connection.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import ExecutionStep from '@/models/execution-step.js';
import { runFlowWorkerJobs } from '@/test/workers/flow.js';
import githubNewIssuesResponse from '../api-mocks/github-new-issues.json';
import appConfig from '@/config/app.js';
import User from '@/models/user.js';

describe.sequential('Third-party app (GitHub) polling async', () => {
  let currentUser,
    flow,
    githubTriggerStep,
    githubConnection,
    formatterStep,
    ntfyStep,
    ntfyConnection;

  beforeEach(async () => {
    currentUser = await createUser();

    flow = await createFlow({
      userId: currentUser.id,
      name: 'GitHub polling test flow',
    });

    githubConnection = await createConnection({
      userId: currentUser.id,
      key: 'github',
      formattedData: {
        consumerKey: 'github-test-consumer-key',
        consumerSecret: 'github-test-consumer-secret',
        accessToken: 'github-test-access-token',
        scope: 'read:org,repo,user',
        tokenType: 'bearer',
        userId: 123456,
        screenName: 'test-user',
      },
    });

    githubTriggerStep = await createStep({
      flowId: flow.id,
      connectionId: githubConnection.id,
      type: 'trigger',
      appKey: 'github',
      key: 'newIssues',
      name: 'GitHub new issues trigger',
      parameters: {
        repo: 'automatisch/automatisch',
        issueType: 'all',
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
        input: `Hey {{step.${githubTriggerStep.id}.user.login}}, welcome to the party!`,
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
        title: 'New GitHub Issue',
        topic: 'automatisch-github-test',
        attach: '',
        message: `{{step.${formatterStep.id}.output}} New issue: {{step.${githubTriggerStep.id}.url}} by {{step.${githubTriggerStep.id}.user.login}}`,
        filename: '',
        priority: 3,
      },
      position: 3,
      status: 'completed',
    });

    await flow.updateStatus(true);

    nock('https://api.github.com')
      .persist()
      .get('/repos/automatisch/automatisch/issues')
      .query({
        filter: 'all',
        state: 'all',
        sort: 'created',
        direction: 'desc',
        per_page: 100,
      })
      .reply(200, githubNewIssuesResponse);

    nock('https://ntfy.sh').persist().post('/').reply(200, {
      id: 'GH123456789',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-github-test',
      title: 'New GitHub Issue',
      message:
        'Hey Farukaydin, Welcome To The Party! New issue: https://api.github.com/repos/automatisch/automatisch/issues/2626 by farukaydin',
      priority: 3,
    });
  });

  it('should create 100 executions when polling finds 100 new issues', async () => {
    const timeBeforePolling = new Date();

    await runFlowWorkerJobs(flow.id);

    const executions = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforePolling.toISOString());

    expect(executions).toBeDefined();
    expect(executions.length).toBe(100);
  });

  it('should create 300 execution steps when polling finds 100 new issues', async () => {
    const timeBeforePolling = new Date();

    await runFlowWorkerJobs(flow.id);

    const executions = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforePolling.toISOString());

    const executionSteps = await ExecutionStep.query()
      .whereIn(
        'executionId',
        executions.map((execution) => execution.id)
      )
      .whereIn('stepId', [githubTriggerStep.id, formatterStep.id, ntfyStep.id]);

    expect(executionSteps).toBeDefined();
    expect(executionSteps.length).toBe(300);
  });

  it('should create execution step with correct data transformation', async () => {
    const timeBeforePolling = new Date();

    await runFlowWorkerJobs(flow.id);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforePolling.toISOString())
      .orderBy('createdAt', 'desc')
      .first();

    const executionSteps = await ExecutionStep.query()
      .where('executionId', execution.id)
      .whereIn('stepId', [githubTriggerStep.id, formatterStep.id, ntfyStep.id])
      .orderBy('createdAt', 'asc');

    expect(executionSteps).toBeDefined();
    expect(executionSteps.length).toBe(3);
  });

  it('should create execution steps with correct data', async () => {
    const timeBeforePolling = new Date();

    await runFlowWorkerJobs(flow.id);

    const lastExecution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('status', 'success')
      .andWhere('testRun', false)
      .andWhere('createdAt', '>', timeBeforePolling.toISOString())
      .orderBy('createdAt', 'desc')
      .first();

    const executionSteps = await ExecutionStep.query()
      .where('executionId', lastExecution.id)
      .whereIn('stepId', [githubTriggerStep.id, formatterStep.id, ntfyStep.id])
      .orderBy('createdAt', 'asc');

    expect(executionSteps.length).toBe(3);

    expect(executionSteps[0].status).toBe('success');
    expect(executionSteps[0].stepId).toBe(githubTriggerStep.id);

    expect(executionSteps[0].dataIn).toStrictEqual({
      issueType: 'all',
      repo: 'automatisch/automatisch',
    });

    expect(executionSteps[0].dataOut).toStrictEqual(githubNewIssuesResponse[0]);

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].stepId).toBe(formatterStep.id);

    expect(executionSteps[1].dataIn).toMatchObject({
      input: 'Hey farukaydin, welcome to the party!',
      transform: 'capitalize',
    });

    expect(executionSteps[1].dataOut).toMatchObject({
      output: 'Hey Farukaydin, Welcome To The Party!',
    });

    expect(executionSteps[2].status).toBe('success');
    expect(executionSteps[2].stepId).toBe(ntfyStep.id);

    expect(executionSteps[2].dataIn).toMatchObject({
      attach: '',
      click: '',
      delay: '',
      email: '',
      filename: '',
      message:
        'Hey Farukaydin, Welcome To The Party! New issue: https://api.github.com/repos/automatisch/automatisch/issues/2626 by farukaydin',
      priority: 3,
      tags: [],
      title: 'New GitHub Issue',
      topic: 'automatisch-github-test',
    });

    expect(executionSteps[2].dataOut).toMatchObject({
      id: 'GH123456789',
      time: 1755279302,
      expires: 1755322502,
      event: 'message',
      topic: 'automatisch-github-test',
      title: 'New GitHub Issue',
      message:
        'Hey Farukaydin, Welcome To The Party! New issue: https://api.github.com/repos/automatisch/automatisch/issues/2626 by farukaydin',
      priority: 3,
    });
  });

  it('should not create execution if cloud quota is exceeded', async () => {
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
    vi.spyOn(User.prototype, 'isAllowedToRunFlows').mockResolvedValue(false);

    const timeBeforePolling = new Date();

    await runFlowWorkerJobs(flow.id);

    const execution = await Execution.query()
      .where('flowId', flow.id)
      .andWhere('createdAt', '>', timeBeforePolling.toISOString())
      .first();

    expect(execution).toBeUndefined();
  });
});
