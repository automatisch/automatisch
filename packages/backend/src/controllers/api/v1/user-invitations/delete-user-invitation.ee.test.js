import Crypto from 'crypto';
import request from 'supertest';
import { beforeEach, describe, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createUser } from '../../../../../test/factories/user.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('DELETE /api/v1/user-invitations/:userId', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
  });

  it('should soft delete user invitation and respond with no content', async () => {
    const user = await createUser({ status: 'invited' });

    await request(app)
      .delete(`/api/v1/user-invitations/${user.id}`)
      .set('x-api-token', token)
      .expect(204);
  });
  it('should return not found response for active user', async () => {
    const user = await createUser();

    await request(app)
      .delete(`/api/v1/user-invitations/${user.id}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return not found response for not existing user UUID', async () => {
    const notExistingUserUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/api/v1/user-invitations/${notExistingUserUUID}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .delete('/api/v1/user-invitations/invalidUserUUID')
      .set('x-api-token', token)
      .expect(400);
  });
});
