import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createConnection } from '../../../../../../test/factories/connection.js';
import { createPermission } from '../../../../../../test/factories/permission.js';

describe('POST /internal/api/v1/connections/:connectionId/auth-url', () => {
  let currentUser, token;

  beforeEach(async () => {
    currentUser = await createUser();

    await createPermission({
      action: 'manage',
      subject: 'Connection',
      roleId: currentUser.roleId,
      conditions: ['isCreator'],
    });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should generate auth url for the connection', async () => {
    const connection = await createConnection({
      userId: currentUser.id,
      key: 'gitlab',
      formattedData: {
        clientId: 'CLIENT_ID',
        oAuthRedirectUrl: 'http://localhost:3001/app/gitlab/connections/add',
      },
      verified: false,
    });

    const response = await request(app)
      .post(`/internal/api/v1/connections/${connection.id}/auth-url`)
      .set('Authorization', token)
      .expect(200);

    expect(response.body.data).toStrictEqual({
      url: expect.stringContaining('https://gitlab.com/oauth/authorize?'),
    });

    expect(response.body.data).toStrictEqual({
      url: expect.stringContaining('client_id=CLIENT_ID'),
    });

    expect(response.body.data).toStrictEqual({
      url: expect.stringContaining(
        `redirect_uri=${encodeURIComponent(
          'http://localhost:3001/app/gitlab/connections/add'
        )}`
      ),
    });
  });

  it(`should return internal server error response for invalid connection data`, async () => {
    const connection = await createConnection({
      userId: currentUser.id,
      key: 'gitlab',
      formattedData: {
        instanceUrl: 123,
      },
      verified: false,
    });

    await request(app)
      .post(`/internal/api/v1/connections/${connection.id}/auth-url`)
      .set('Authorization', token)
      .expect(500);
  });

  it('should return not found response for not existing connection UUID', async () => {
    const notExistingConnectionUUID = Crypto.randomUUID();

    await request(app)
      .post(
        `/internal/api/v1/connections/${notExistingConnectionUUID}/auth-url`
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .post('/internal/api/v1/connections/invalidConnectionUUID/auth-url')
      .set('Authorization', token)
      .expect(400);
  });
});
