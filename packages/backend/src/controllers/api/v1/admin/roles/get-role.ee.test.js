import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import getRoleMock from '../../../../../../test/mocks/rest/api/v1/admin/roles/get-role.ee.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /api/v1/admin/roles/:roleId', () => {
  let role, currentUser, token, permissionOne, permissionTwo;

  beforeEach(async () => {
    role = await createRole({ key: 'admin' });
    permissionOne = await createPermission({ roleId: role.id });
    permissionTwo = await createPermission({ roleId: role.id });
    currentUser = await createUser({ roleId: role.id });

    token = createAuthTokenByUserId(currentUser.id);
  });

  it('should return roles', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    const response = await request(app)
      .get(`/api/v1/admin/roles/${role.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getRoleMock(role, [
      permissionOne,
      permissionTwo,
    ]);

    expect(response.body).toEqual(expectedPayload);
  });
});
