import Crypto from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, it, vi } from 'vitest';
import { createUser } from '../../../../../test/factories/user.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('DELETE /api/v1/users/:userId', () => {
  let user, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    user = await createUser();
    token = (await createApiToken()).token;
  });

  it('should soft delete user and respond with no content', async () => {
    await request(app)
      .delete(`/api/v1/users/${user.id}`)
      .set('x-api-token', token)
      .expect(204);
  });

  it('should return not found response for not existing user UUID', async () => {
    const notExistingUserUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/api/v1/users/${notExistingUserUUID}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .delete('/api/v1/users/invalidUserUUID')
      .set('x-api-token', token)
      .expect(400);
  });
});
