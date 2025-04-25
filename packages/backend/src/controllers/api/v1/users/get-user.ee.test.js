import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../app.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createRole } from '../../../../../test/factories/role.js';
import getUserMock from '../../../../../test/mocks/rest/api/v1/users/get-user.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/users/:userId', () => {
  let user, userRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    userRole = await createRole({ name: 'Admin' });
    user = await createUser({ roleId: userRole.id });

    token = (await createApiToken()).token;
  });

  it('should return specified user info', async () => {
    const response = await request(app)
      .get(`/api/v1/users/${user.id}`)
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = getUserMock(user, userRole);
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing user UUID', async () => {
    const notExistingUserUUID = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/users/${notExistingUserUUID}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .get('/api/v1/users/invalidUserUUID')
      .set('x-api-token', token)
      .expect(400);
  });
});
