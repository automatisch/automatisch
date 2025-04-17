import Crypto from 'node:crypto';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createApiToken } from '../../../../../../../test/factories/api-token.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('DELETE /internal/api/v1/admin/api-tokens/:id', () => {
  let adminRole, currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ name: 'Admin' });

    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should delete the api token and return HTTP 204', async () => {
    const apiToken = await createApiToken();

    await request(app)
      .delete(`/internal/api/v1/admin/api-tokens/${apiToken.id}`)
      .set('Authorization', token)
      .expect(204);

    const refetchedApiToken = await apiToken.$query();

    expect(refetchedApiToken).toBeUndefined();
  });

  it('should return HTTP 404 for not existing api token id', async () => {
    const notExistingApiTokenId = Crypto.randomUUID();

    await request(app)
      .delete(`/internal/api/v1/admin/api-tokens/${notExistingApiTokenId}`)
      .set('Authorization', token)
      .expect(404);
  });
});
