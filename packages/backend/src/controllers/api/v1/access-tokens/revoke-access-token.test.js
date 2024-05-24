import { expect, describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user.js';
import AccessToken from '../../../../models/access-token.js';

describe('DELETE /api/v1/access-tokens/:token', () => {
  let token;

  beforeEach(async () => {
    const currentUser = await createUser({
      email: 'user@automatisch.io',
      password: 'password',
    });
    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should respond with HTTP 204 with correct token', async () => {
    await request(app)
      .delete(`/api/v1/access-tokens/${token}`)
      .set('Authorization', token)
      .expect(204);

    const revokedToken = await AccessToken.query().findOne({ token });

    expect(revokedToken).toBeDefined();
    expect(revokedToken.revokedAt).not.toBeNull();
  });

  it('should respond with HTTP 401 with incorrect credentials', async () => {
    await request(app)
      .delete(`/api/v1/access-tokens/${token}`)
      .set('Authorization', 'wrong-token')
      .expect(401);

    const unrevokedToken = await AccessToken.query().findOne({ token });

    expect(unrevokedToken).toBeDefined();
    expect(unrevokedToken.revokedAt).toBeNull();
  });

  it('should respond with HTTP 404 with correct credentials, but non-valid token', async () => {
    await request(app)
      .delete('/api/v1/access-tokens/wrong-token')
      .set('Authorization', token)
      .expect(404);

    const unrevokedToken = await AccessToken.query().findOne({ token });

    expect(unrevokedToken).toBeDefined();
    expect(unrevokedToken.revokedAt).toBeNull();
  });
});
