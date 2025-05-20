import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createConnection } from '../../../../../../test/factories/connection.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import updateConnectionMock from '../../../../../../test/mocks/rest/internal/api/v1/connections/update-connection.js';

describe('PATCH /internal/api/v1/connections/:connectionId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should update the connection with valid data for current user', async () => {
    const connectionData = {
      userId: currentUser.id,
      key: 'deepl',
      verified: true,
      formattedData: {
        screenName: 'Connection name',
        clientSecret: 'secret',
        clientId: 'id',
        token: 'token',
      },
    };

    const currentUserConnection = await createConnection(connectionData);

    await createPermission({
      action: 'manage',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .patch(`/internal/api/v1/connections/${currentUserConnection.id}`)
      .set('Authorization', token)
      .send({
        formattedData: {
          screenName: 'New connection name',
          clientSecret: 'new secret',
          clientId: 'new id',
          token: 'new token',
        },
      })
      .expect(200);

    const refetchedCurrentUserConnection = await currentUserConnection.$query();

    const expectedPayload = updateConnectionMock(
      refetchedCurrentUserConnection
    );

    expect(response.body).toStrictEqual(expectedPayload);
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
      .patch(`/internal/api/v1/connections/${anotherUserConnection.id}`)
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
      .patch(`/internal/api/v1/connections/${notExistingConnectionUUID}`)
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
      .patch('/internal/api/v1/connections/invalidConnectionUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
