import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import getPermissionsCatalogMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/permissions/get-permissions-catalog.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('GET /internal/api/v1/admin/permissions/catalog', () => {
  let role, currentUser, token;

  beforeEach(async () => {
    role = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return roles', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    const response = await request(app)
      .get('/internal/api/v1/admin/permissions/catalog')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getPermissionsCatalogMock();

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
