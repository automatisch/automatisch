import { describe, it, expect, beforeEach } from 'vitest';
import nock from 'nock';
import Execution from '@/models/execution.js';
import { createUser } from '@/factories/user.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import { createConnection } from '@/factories/connection.js';
import githubNewIssuesResponse from '../api-mocks/github-new-issues.json';

describe.sequential('Third-party polling async test and continue', () => {
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
  });

  it('should respond last execution step with error', async () => {
    nock('https://ntfy.sh').persist().post('/').reply(400, {
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
    expect(executionSteps[0].dataOut).toMatchObject(githubNewIssuesResponse[0]);
    expect(executionSteps[0].errorDetails).toBeNull();

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].dataOut).toMatchObject({
      output: 'Hey Farukaydin, Welcome To The Party!',
    });
    expect(executionSteps[1].errorDetails).toBeNull();
  });

  it('should respond last execution step with success', async () => {
    nock('https://ntfy.sh').post('/').reply(200, {
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

    const testedStep = await ntfyStep.testAndContinue();

    const lastExecution = await testedStep.lastExecutionStep.$relatedQuery(
      'execution'
    );

    expect(lastExecution.status).toBe('success');
    expect(lastExecution.testRun).toBe(true);

    expect(testedStep.lastExecutionStep.status).toBe('success');
    expect(testedStep.lastExecutionStep.dataOut).toMatchObject({
      event: 'message',
      expires: 1755322502,
      id: 'GH123456789',
      message:
        'Hey Farukaydin, Welcome To The Party! New issue: https://api.github.com/repos/automatisch/automatisch/issues/2626 by farukaydin',
      priority: 3,
      time: 1755279302,
      title: 'New GitHub Issue',
      topic: 'automatisch-github-test',
    });

    expect(testedStep.lastExecutionStep.errorDetails).toBeNull();

    const executionSteps = await lastExecution
      .$relatedQuery('executionSteps')
      .orderBy('createdAt', 'asc');

    expect(executionSteps.length).toBe(3);
    expect(executionSteps[0].status).toBe('success');
    expect(executionSteps[0].dataOut).toMatchObject(githubNewIssuesResponse[0]);
    expect(executionSteps[0].errorDetails).toBeNull();

    expect(executionSteps[1].status).toBe('success');
    expect(executionSteps[1].dataOut).toMatchObject({
      output: 'Hey Farukaydin, Welcome To The Party!',
    });
    expect(executionSteps[1].errorDetails).toBeNull();
  });

  it('should create only one execution', async () => {
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
