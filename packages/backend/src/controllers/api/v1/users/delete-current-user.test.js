import { describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';

describe('DELETE /api/v1/users/:userId', () => {
  let currentUser, token;

  beforeEach(async () => {
    currentUser = await createUser();
    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should remove user and return 204 no content', async () => {
    await request(app)
      .delete(`/api/v1/users/${currentUser.id}`)
      .set('Authorization', token)
      .expect(204);
  });
});
