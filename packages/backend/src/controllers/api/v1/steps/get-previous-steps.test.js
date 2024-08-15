import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import { createFlow } from '../../../../../test/factories/flow';
import { createStep } from '../../../../../test/factories/step';
import { createExecutionStep } from '../../../../../test/factories/execution-step.js';
import { createPermission } from '../../../../../test/factories/permission';
import getPreviousStepsMock from '../../../../../test/mocks/rest/api/v1/steps/get-previous-steps';

describe('GET /api/v1/steps/:stepId/previous-steps', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the previous steps of the specified step of the current user', async () => {
    const currentUserflow = await createFlow({ userId: currentUser.id });

    const triggerStep = await createStep({
      flowId: currentUserflow.id,
      type: 'trigger',
    });

    const actionStepOne = await createStep({
      flowId: currentUserflow.id,
      type: 'action',
    });

    const actionStepTwo = await createStep({
      flowId: currentUserflow.id,
      type: 'action',
    });

    const executionStepOne = await createExecutionStep({
      stepId: triggerStep.id,
    });

    const executionStepTwo = await createExecutionStep({
      stepId: actionStepOne.id,
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'update',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/api/v1/steps/${actionStepTwo.id}/previous-steps`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getPreviousStepsMock(
      [triggerStep, actionStepOne],
      [executionStepOne, executionStepTwo]
    );

    expect(response.body).toEqual(expectedPayload);
  });

  it('should return the previous steps of the specified step of another user', async () => {
    const anotherUser = await createUser();
    const anotherUserFlow = await createFlow({ userId: anotherUser.id });

    const triggerStep = await createStep({
      flowId: anotherUserFlow.id,
      type: 'trigger',
    });

    const actionStepOne = await createStep({
      flowId: anotherUserFlow.id,
      type: 'action',
    });

    const actionStepTwo = await createStep({
      flowId: anotherUserFlow.id,
      type: 'action',
    });

    const executionStepOne = await createExecutionStep({
      stepId: triggerStep.id,
    });

    const executionStepTwo = await createExecutionStep({
      stepId: actionStepOne.id,
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'update',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .get(`/api/v1/steps/${actionStepTwo.id}/previous-steps`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getPreviousStepsMock(
      [triggerStep, actionStepOne],
      [executionStepOne, executionStepTwo]
    );

    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response for not existing step UUID', async () => {
    await createPermission({
      action: 'update',
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

    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/steps/${notExistingFlowUUID}/previous-steps`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await createPermission({
      action: 'update',
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
      .get('/api/v1/steps/invalidFlowUUID/previous-steps')
      .set('Authorization', token)
      .expect(400);
  });
});
