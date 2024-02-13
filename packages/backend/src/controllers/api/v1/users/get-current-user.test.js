import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import currentUserPayload from '../../../../../test/payloads/current-user.js';

describe('GET /api/v1/users/me', () => {
  let role, currentUser, token;

  beforeEach(async () => {
    currentUser = await createUser();
    role = await currentUser.$relatedQuery('role');
    token = createAuthTokenByUserId(currentUser.id);
  });

  it('should return current user info', async () => {
    const response = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = currentUserPayload(currentUser, role);
    expect(response.body).toEqual(expectedPayload);
  });
});
