import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import { createExecution } from '@/factories/execution.js';
import { createPermission } from '@/factories/permission.js';
import getExecutionMock from '@/mocks/rest/internal/api/v1/executions/get-execution.js';

describe('GET /internal/api/v1/executions/:executionId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the execution data of current user', async () => {
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

    await createPermission({
      action: 'read',
      subject: 'Execution',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/internal/api/v1/executions/${currentUserExecution.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getExecutionMock(
      currentUserExecution,
      currentUserFlow,
      [stepOne, stepTwo]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return the execution data of another user', async () => {
    const anotherUser = await createUser();

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

    await createPermission({
      action: 'read',
      subject: 'Execution',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .get(`/internal/api/v1/executions/${anotherUserExecution.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getExecutionMock(
      anotherUserExecution,
      anotherUserFlow,
      [stepOne, stepTwo]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing execution UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Execution',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingExcecutionUUID = Crypto.randomUUID();

    await request(app)
      .get(`/internal/api/v1/executions/${notExistingExcecutionUUID}`)
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
      .get('/internal/api/v1/executions/invalidExecutionUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
