import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createConnection } from '../../../../../../test/factories/connection.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import { createExecution } from '../../../../../../test/factories/execution.js';
import { createExecutionStep } from '../../../../../../test/factories/execution-step.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import testStepMock from '../../../../../../test/mocks/rest/internal/api/v1/steps/test-step.js';

describe('POST /internal/api/v1/steps/:stepId/test', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should test the step of the current user and return step data', async () => {
    const currentUserFlow = await createFlow({ userId: currentUser.id });
    const currentUserConnection = await createConnection();

    const triggerStep = await createStep({
      flowId: currentUserFlow.id,
      connectionId: currentUserConnection.id,
      appKey: 'webhook',
      key: 'catchRawWebhook',
      type: 'trigger',
      parameters: {
        workSynchronously: false,
      },
    });

    const actionStep = await createStep({
      flowId: currentUserFlow.id,
      connectionId: currentUserConnection.id,
      appKey: 'formatter',
      key: 'text',
      type: 'action',
      parameters: {
        input: `{{step.${triggerStep.id}.body.name}}`,
        transform: 'capitalize',
      },
    });

    const execution = await createExecution({
      flowId: currentUserFlow.id,
      testRun: true,
    });

    await createExecutionStep({
      dataIn: { workSynchronously: false },
      dataOut: { body: { name: 'john doe' } },
      stepId: triggerStep.id,
      executionId: execution.id,
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post(`/internal/api/v1/steps/${actionStep.id}/test`)
      .set('Authorization', token)
      .expect(200);

    const expectedLastExecutionStep = await actionStep.$relatedQuery(
      'lastExecutionStep'
    );

    const expectedPayload = await testStepMock(
      actionStep,
      expectedLastExecutionStep
    );

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should test the step of the another user and return step data', async () => {
    const anotherUser = await createUser();
    const anotherUserFlow = await createFlow({ userId: anotherUser.id });
    const anotherUserConnection = await createConnection();

    const triggerStep = await createStep({
      flowId: anotherUserFlow.id,
      connectionId: anotherUserConnection.id,
      appKey: 'webhook',
      key: 'catchRawWebhook',
      type: 'trigger',
      parameters: {
        workSynchronously: false,
      },
    });

    const actionStep = await createStep({
      flowId: anotherUserFlow.id,
      connectionId: anotherUserConnection.id,
      appKey: 'formatter',
      key: 'text',
      type: 'action',
      parameters: {
        input: `{{step.${triggerStep.id}.body.name}}`,
        transform: 'capitalize',
      },
    });

    const execution = await createExecution({
      flowId: anotherUserFlow.id,
      testRun: true,
    });

    await createExecutionStep({
      dataIn: { workSynchronously: false },
      dataOut: { body: { name: 'john doe' } },
      stepId: triggerStep.id,
      executionId: execution.id,
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .post(`/internal/api/v1/steps/${actionStep.id}/test`)
      .set('Authorization', token)
      .expect(200);

    const expectedLastExecutionStep = await actionStep.$relatedQuery(
      'lastExecutionStep'
    );

    const expectedPayload = await testStepMock(
      actionStep,
      expectedLastExecutionStep
    );

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return not found response for not existing step UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingStepUUID = Crypto.randomUUID();

    await request(app)
      .post(`/internal/api/v1/steps/${notExistingStepUUID}/test`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid step UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .post('/internal/api/v1/steps/invalidStepUUID/test')
      .set('Authorization', token)
      .expect(400);
  });
});
