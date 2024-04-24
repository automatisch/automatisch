import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createPermission } from '../../../../../test/factories/permission';
import { createRole } from '../../../../../test/factories/role';
import { createUser } from '../../../../../test/factories/user';
import getCurrentUserMock from '../../../../../test/mocks/rest/api/v1/users/get-current-user';

describe('GET /api/v1/users/me', () => {
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
      .get('/api/v1/users/me')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getCurrentUserMock(currentUser, role, [
      permissionOne,
      permissionTwo,
    ]);

    expect(response.body).toEqual(expectedPayload);
  });
});
