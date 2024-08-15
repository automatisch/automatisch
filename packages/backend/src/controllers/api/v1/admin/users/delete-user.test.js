import { describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../../test/factories/user';
import { createRole } from '../../../../../../test/factories/role';

describe('DELETE /api/v1/admin/users/:userId', () => {
  let currentUser, currentUserRole, anotherUser, token;

  beforeEach(async () => {
    currentUserRole = await createRole({ key: 'admin' });
    currentUser = await createUser({ roleId: currentUserRole.id });

    anotherUser = await createUser();

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should soft delete user and respond with no content', async () => {
    await request(app)
      .delete(`/api/v1/admin/users/${anotherUser.id}`)
      .set('Authorization', token)
      .expect(204);
  });

  it('should return not found response for not existing user UUID', async () => {
    const notExistingUserUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/api/v1/admin/users/${notExistingUserUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .delete('/api/v1/admin/users/invalidUserUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
