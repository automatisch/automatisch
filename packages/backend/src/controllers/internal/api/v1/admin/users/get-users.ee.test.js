import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import getUsersMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/users/get-users.js';

describe('GET /internal/api/v1/admin/users', () => {
  let currentUser, currentUserRole, anotherUser, anotherUserRole, token;

  beforeEach(async () => {
    currentUserRole = await createRole({ name: 'Admin' });

    currentUser = await createUser({
      roleId: currentUserRole.id,
      fullName: 'Current User',
    });

    anotherUserRole = await createRole({
      name: 'Another user role',
    });

    anotherUser = await createUser({
      roleId: anotherUserRole.id,
      fullName: 'Another User',
    });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return users data', async () => {
    const response = await request(app)
      .get('/internal/api/v1/admin/users')
      .set('Authorization', token)
      .expect(200);

    const expectedResponsePayload = await getUsersMock(
      [anotherUser, currentUser],
      [anotherUserRole, currentUserRole]
    );

    expect(response.body).toStrictEqual(expectedResponsePayload);
  });
});
