import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import { createPermission } from '../../../../../test/factories/permission';
import getUserMock from '../../../../../test/mocks/rest/api/v1/users/get-user';

describe('GET /api/v1/users/:userId', () => {
  let currentUser, currentUserRole, anotherUser, anotherUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    anotherUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');
    anotherUserRole = await anotherUser.$relatedQuery('role');

    await createPermission({
      roleId: currentUserRole.id,
      action: 'read',
      subject: 'User',
    });

    token = createAuthTokenByUserId(currentUser.id);
  });

  it('should return specified user info', async () => {
    const response = await request(app)
      .get(`/api/v1/users/${anotherUser.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getUserMock(anotherUser, anotherUserRole);
    expect(response.body).toEqual(expectedPayload);
  });
});
