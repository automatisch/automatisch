import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createRole } from '../../../../../test/factories/role';
import { createPermission } from '../../../../../test/factories/permission';
import { createUser } from '../../../../../test/factories/user';
import getUsersMock from '../../../../../test/mocks/rest/api/v1/users/get-users';

describe('GET /api/v1/users', () => {
  let currentUser, currentUserRole, anotherUser, anotherUserRole, token;

  beforeEach(async () => {
    currentUserRole = await createRole({
      key: 'currentUser',
      name: 'Current user role',
    });

    await createPermission({
      action: 'read',
      subject: 'User',
      roleId: currentUserRole.id,
    });

    currentUser = await createUser({
      roleId: currentUserRole.id,
      fullName: 'Current User',
    });

    anotherUserRole = await createRole({
      key: 'anotherUser',
      name: 'Another user role',
    });

    anotherUser = await createUser({
      roleId: anotherUserRole.id,
      fullName: 'Another User',
    });

    token = createAuthTokenByUserId(currentUser.id);
  });

  it('should return users data', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('Authorization', token)
      .expect(200);

    const expectedResponsePayload = await getUsersMock(
      [anotherUser, currentUser],
      [anotherUserRole, currentUserRole]
    );

    expect(response.body).toEqual(expectedResponsePayload);
  });
});
