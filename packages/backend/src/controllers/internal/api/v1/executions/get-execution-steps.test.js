import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import { createExecution } from '@/factories/execution.js';
import { createExecutionStep } from '@/factories/execution-step.js';
import { createPermission } from '@/factories/permission.js';
import getExecutionStepsMock from '@/mocks/rest/internal/api/v1/executions/get-execution-steps.js';

describe('GET /internal/api/v1/executions/:executionId/execution-steps', () => {
  let currentUser, currentUserRole, anotherUser, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    anotherUser = await createUser();

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the execution steps of current user execution', async () => {
    const currentUserFlow = await createFlow({
      userId: currentUser.id,
    });

    const stepOne = await createStep({
      flowId: currentUserFlow.id,
      type: 'trigger',
    });

    const stepTwo = await createStep({
      flowId: currentUserFlow.id,
      type: 'action',
    });

    const currentUserExecution = await createExecution({
      flowId: currentUserFlow.id,
    });

    const currentUserExecutionStepOne = await createExecutionStep({
      executionId: currentUserExecution.id,
      stepId: stepOne.id,
    });

    const currentUserExecutionStepTwo = await createExecutionStep({
      executionId: currentUserExecution.id,
      stepId: stepTwo.id,
    });

    await createPermission({
      action: 'read',
      subject: 'Execution',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(
        `/internal/api/v1/executions/${currentUserExecution.id}/execution-steps`
      )
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getExecutionStepsMock(
      [currentUserExecutionStepOne, currentUserExecutionStepTwo],
      [stepOne, stepTwo]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return the execution steps of another user execution', async () => {
    const anotherUserFlow = await createFlow({
      userId: anotherUser.id,
    });

    const stepOne = await createStep({
      flowId: anotherUserFlow.id,
      type: 'trigger',
    });

    const stepTwo = await createStep({
      flowId: anotherUserFlow.id,
      type: 'action',
    });

    const anotherUserExecution = await createExecution({
      flowId: anotherUserFlow.id,
    });

    const anotherUserExecutionStepOne = await createExecutionStep({
      executionId: anotherUserExecution.id,
      stepId: stepOne.id,
    });

    const anotherUserExecutionStepTwo = await createExecutionStep({
      executionId: anotherUserExecution.id,
      stepId: stepTwo.id,
    });

    await createPermission({
      action: 'read',
      subject: 'Execution',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .get(
        `/internal/api/v1/executions/${anotherUserExecution.id}/execution-steps`
      )
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getExecutionStepsMock(
      [anotherUserExecutionStepOne, anotherUserExecutionStepTwo],
      [stepOne, stepTwo]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing execution step UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Execution',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingExecutionUUID = Crypto.randomUUID();

    await request(app)
      .get(
        `/internal/api/v1/executions/${notExistingExecutionUUID}/execution-steps`
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Execution',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .get('/internal/api/v1/executions/invalidExecutionUUID/execution-steps')
      .set('Authorization', token)
      .expect(400);
  });
});
