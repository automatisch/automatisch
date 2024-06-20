import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createConnection } from '../../../../../test/factories/connection.js';
import { createPermission } from '../../../../../test/factories/permission.js';
import getConnectionsMock from '../../../../../test/mocks/rest/api/v1/apps/get-connections.js';

describe('GET /api/v1/apps/:appKey/connections', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the connections data of specified app for current user', async () => {
    const currentUserConnectionOne = await createConnection({
      userId: currentUser.id,
      key: 'deepl',
      draft: false,
    });

    const currentUserConnectionTwo = await createConnection({
      userId: currentUser.id,
      key: 'deepl',
      draft: false,
    });

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get('/api/v1/apps/deepl/connections')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getConnectionsMock([
      currentUserConnectionTwo,
      currentUserConnectionOne,
    ]);

    expect(response.body).toEqual(expectedPayload);
  });

  it('should return the connections data of specified app for another user', async () => {
    const anotherUser = await createUser();

    const anotherUserConnectionOne = await createConnection({
      userId: anotherUser.id,
      key: 'deepl',
      draft: false,
    });

    const anotherUserConnectionTwo = await createConnection({
      userId: anotherUser.id,
      key: 'deepl',
      draft: false,
    });

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .get('/api/v1/apps/deepl/connections')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getConnectionsMock([
      anotherUserConnectionTwo,
      anotherUserConnectionOne,
    ]);

    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response for invalid connection UUID', async () => {
    await createPermission({
      action: 'update',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .get('/api/v1/connections/invalid-connection-id/connections')
      .set('Authorization', token)
      .expect(404);
  });
});
