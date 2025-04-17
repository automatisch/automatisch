import { describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createConnection } from '../../../../../../test/factories/connection.js';
import { createPermission } from '../../../../../../test/factories/permission.js';

describe('DELETE /internal/api/v1/connections/:connectionId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    await createPermission({
      action: 'manage',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should delete the connection for current user', async () => {
    const currentUserConnection = await createConnection({
      userId: currentUser.id,
      key: 'deepl',
      verified: true,
    });

    await request(app)
      .delete(`/internal/api/v1/connections/${currentUserConnection.id}`)
      .set('Authorization', token)
      .expect(204);
  });

  it(`should return not found for other users' connections`, async () => {
    const anotherUser = await createUser();

    const anotherUserConnection = await createConnection({
      userId: anotherUser.id,
      key: 'deepl',
      verified: true,
    });

    await request(app)
      .post(`/internal/api/v1/connections/${anotherUserConnection.id}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not found response for not existing connection UUID', async () => {
    const notExistingConnectionUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/internal/api/v1/connections/${notExistingConnectionUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .delete('/internal/api/v1/connections/invalidConnectionUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
