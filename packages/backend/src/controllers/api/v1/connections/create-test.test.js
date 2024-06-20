import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createConnection } from '../../../../../test/factories/connection.js';
import { createPermission } from '../../../../../test/factories/permission.js';

describe('POST /api/v1/connections/:connectionId/test', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should update the connection as not verified for current user', async () => {
    const currentUserConnection = await createConnection({
      userId: currentUser.id,
      key: 'deepl',
      verified: true,
    });

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'update',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post(`/api/v1/connections/${currentUserConnection.id}/test`)
      .set('Authorization', token)
      .expect(200);

    expect(response.body.data.verified).toEqual(false);
  });

  it('should update the connection as not verified for another user', async () => {
    const anotherUser = await createUser();

    const anotherUserConnection = await createConnection({
      userId: anotherUser.id,
      key: 'deepl',
      verified: true,
    });

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'update',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .post(`/api/v1/connections/${anotherUserConnection.id}/test`)
      .set('Authorization', token)
      .expect(200);

    expect(response.body.data.verified).toEqual(false);
  });

  it('should return not found response for not existing connection UUID', async () => {
    const notExistingConnectionUUID = Crypto.randomUUID();

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'update',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .post(`/api/v1/connections/${notExistingConnectionUUID}/test`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'update',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .post('/api/v1/connections/invalidConnectionUUID/test')
      .set('Authorization', token)
      .expect(400);
  });
});
