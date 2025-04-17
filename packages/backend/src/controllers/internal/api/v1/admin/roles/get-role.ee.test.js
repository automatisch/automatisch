import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createPermission } from '../../../../../../../test/factories/permission.js';
import getRoleMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/roles/get-role.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('GET /internal/api/v1/admin/roles/:roleId', () => {
  let role, currentUser, token, permissionOne, permissionTwo;

  beforeEach(async () => {
    role = await createRole({ name: 'Admin' });
    permissionOne = await createPermission({ roleId: role.id });
    permissionTwo = await createPermission({ roleId: role.id });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return role', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    const response = await request(app)
      .get(`/internal/api/v1/admin/roles/${role.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getRoleMock(role, [
      permissionOne,
      permissionTwo,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing role UUID', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    const notExistingRoleUUID = Crypto.randomUUID();

    await request(app)
      .get(`/internal/api/v1/admin/roles/${notExistingRoleUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    await request(app)
      .get('/internal/api/v1/admin/roles/invalidRoleUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
