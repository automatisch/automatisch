import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import { createConnection } from '../../../../../test/factories/connection';
import { createFlow } from '../../../../../test/factories/flow';
import { createStep } from '../../../../../test/factories/step';
import { createPermission } from '../../../../../test/factories/permission';
import getConnectionMock from '../../../../../test/mocks/rest/api/v1/steps/get-connection';

describe('GET /api/v1/steps/:stepId/connection', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the current user connection data of specified step', async () => {
    const currentUserflow = await createFlow({ userId: currentUser.id });

    const currentUserConnection = await createConnection();
    const triggerStep = await createStep({
      flowId: currentUserflow.id,
      connectionId: currentUserConnection.id,
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/api/v1/steps/${triggerStep.id}/connection`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getConnectionMock(currentUserConnection);

    expect(response.body).toEqual(expectedPayload);
  });

  it('should return the current user connection data of specified step', async () => {
    const anotherUser = await createUser();
    const anotherUserFlow = await createFlow({ userId: anotherUser.id });

    const anotherUserConnection = await createConnection();
    const triggerStep = await createStep({
      flowId: anotherUserFlow.id,
      connectionId: anotherUserConnection.id,
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .get(`/api/v1/steps/${triggerStep.id}/connection`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getConnectionMock(anotherUserConnection);

    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response for not existing step without connection', async () => {
    const stepWithoutConnection = await createStep();

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .get(`/api/v1/steps/${stepWithoutConnection.id}/connection`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not found response for not existing step UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/steps/${notExistingFlowUUID}/connection`)
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
      .get('/api/v1/steps/invalidFlowUUID/connection')
      .set('Authorization', token)
      .expect(400);
  });
});
