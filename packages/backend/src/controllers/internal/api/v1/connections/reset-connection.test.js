import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createConnection } from '../../../../../../test/factories/connection.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import resetConnectionMock from '../../../../../../test/mocks/rest/internal/api/v1/connections/reset-connection.js';

describe('POST /internal/api/v1/connections/:connectionId/reset', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it(`should reset the connection's formatted data`, async () => {
    const currentUserConnection = await createConnection({
      userId: currentUser.id,
      key: 'deepl',
      verified: true,
      formattedData: {
        screenName: 'Connection name',
        clientSecret: 'secret',
        clientId: 'id',
        token: 'token',
      },
    });

    await createPermission({
      action: 'manage',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post(`/internal/api/v1/connections/${currentUserConnection.id}/reset`)
      .set('Authorization', token)
      .expect(200);

    const refetchedCurrentUserConnection = await currentUserConnection.$query();

    const expectedPayload = resetConnectionMock({
      ...refetchedCurrentUserConnection,
      formattedData: {
        screenName: 'Connection name',
      },
    });

    expect(response.body).toStrictEqual(expectedPayload);
    expect(refetchedCurrentUserConnection.formattedData).toStrictEqual(
      expectedPayload.data.formattedData
    );
  });

  it('should return not found response for another user', async () => {
    const anotherUser = await createUser();

    const anotherUserConnection = await createConnection({
      userId: anotherUser.id,
      key: 'deepl',
      verified: true,
    });

    await createPermission({
      action: 'manage',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .post(`/internal/api/v1/connections/${anotherUserConnection.id}/reset`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not found response for not existing connection UUID', async () => {
    const notExistingConnectionUUID = Crypto.randomUUID();

    await createPermission({
      action: 'manage',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .post(`/internal/api/v1/connections/${notExistingConnectionUUID}/reset`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .post('/internal/api/v1/connections/invalidConnectionUUID/reset')
      .set('Authorization', token)
      .expect(400);
  });
});
