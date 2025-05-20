import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import getAdminApiTokensMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/api-tokens/get-api-tokens.js';
import { createApiToken } from '../../../../../../../test/factories/api-token.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('GET /internal/api/v1/admin/api-tokens', () => {
  let currentUser, adminRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return all api tokens', async () => {
    const apiTokenOne = await createApiToken();
    const apiTokenTwo = await createApiToken();

    const response = await request(app)
      .get('/internal/api/v1/admin/api-tokens')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getAdminApiTokensMock([
      apiTokenTwo,
      apiTokenOne,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
