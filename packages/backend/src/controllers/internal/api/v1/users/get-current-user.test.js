import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import { createRole } from '../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../test/factories/user.js';
import getCurrentUserMock from '../../../../../../test/mocks/rest/internal/api/v1/users/get-current-user.js';

describe('GET /internal/api/v1/users/me', () => {
  let role, permissionOne, permissionTwo, currentUser, token;

  beforeEach(async () => {
    role = await createRole();

    permissionOne = await createPermission({
      roleId: role.id,
    });

    permissionTwo = await createPermission({
      roleId: role.id,
    });

    currentUser = await createUser({
      roleId: role.id,
    });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return current user info', async () => {
    const response = await request(app)
      .get('/internal/api/v1/users/me')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getCurrentUserMock(currentUser, role, [
      permissionOne,
      permissionTwo,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
