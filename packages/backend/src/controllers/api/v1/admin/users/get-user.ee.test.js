import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../../test/factories/user';
import { createRole } from '../../../../../../test/factories/role';
import getUserMock from '../../../../../../test/mocks/rest/api/v1/admin/users/get-user.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /api/v1/admin/users/:userId', () => {
  let currentUser, currentUserRole, anotherUser, anotherUserRole, token;

  beforeEach(async () => {
    currentUserRole = await createRole({ key: 'admin' });
    currentUser = await createUser({ roleId: currentUserRole.id });

    anotherUser = await createUser();
    anotherUserRole = await anotherUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return specified user info', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    const response = await request(app)
      .get(`/api/v1/admin/users/${anotherUser.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getUserMock(anotherUser, anotherUserRole);
    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response for not existing user UUID', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    const notExistingUserUUID = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/admin/users/${notExistingUserUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    await request(app)
      .get('/api/v1/admin/users/invalidUserUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
