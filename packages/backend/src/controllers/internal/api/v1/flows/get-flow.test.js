import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import getFlowMock from '../../../../../../test/mocks/rest/internal/api/v1/flows/get-flow.js';

describe('GET /internal/api/v1/flows/:flowId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the flow data of current user', async () => {
    const currentUserflow = await createFlow({ userId: currentUser.id });
    const triggerStep = await createStep({ flowId: currentUserflow.id });
    const actionStep = await createStep({ flowId: currentUserflow.id });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/internal/api/v1/flows/${currentUserflow.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFlowMock(
      currentUserflow,
      [triggerStep, actionStep],
      currentUser.id
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return the flow data of another user', async () => {
    const anotherUser = await createUser();
    const anotherUserFlow = await createFlow({ userId: anotherUser.id });
    const triggerStep = await createStep({ flowId: anotherUserFlow.id });
    const actionStep = await createStep({ flowId: anotherUserFlow.id });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .get(`/internal/api/v1/flows/${anotherUserFlow.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFlowMock(
      anotherUserFlow,
      [triggerStep, actionStep],
      currentUser.id
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing flow UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .get(`/internal/api/v1/flows/${notExistingFlowUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .get('/internal/api/v1/flows/invalidFlowUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
