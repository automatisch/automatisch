import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import App from '../../../../../models/app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createConnection } from '../../../../../../test/factories/connection.js';
import { createPermission } from '../../../../../../test/factories/permission.js';

describe('POST /internal/api/v1/connections/:connectionId/verify', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should update the connection as verified for current user', async () => {
    const currentUserConnection = await createConnection({
      userId: currentUser.id,
      key: 'deepl',
      verified: true,
    });

    await createPermission({
      action: 'manage',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    vi.spyOn(App, 'findOneByKey').mockImplementation((key) => {
      if (key !== currentUserConnection.key) return;

      return {
        auth: {
          verifyCredentials: vi.fn().mockResolvedValue(),
        },
      };
    });

    const response = await request(app)
      .post(`/internal/api/v1/connections/${currentUserConnection.id}/verify`)
      .set('Authorization', token)
      .expect(200);

    expect(response.body.data.verified).toStrictEqual(true);
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
      .post(`/internal/api/v1/connections/${notExistingConnectionUUID}/verify`)
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
      .post('/internal/api/v1/connections/invalidConnectionUUID/verify')
      .set('Authorization', token)
      .expect(400);
  });
});
