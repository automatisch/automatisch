import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import updateUserMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/users/update-user.js';

describe('PATCH /internal/api/v1/admin/users/:userId', () => {
  let currentUser, adminRole, token;

  beforeEach(async () => {
    adminRole = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return updated user with valid data for another user', async () => {
    const anotherUser = await createUser();
    const anotherRole = await createRole();

    const anotherUserUpdatedData = {
      email: 'updated@sample.com',
      fullName: 'Updated Full Name',
      roleId: anotherRole.id,
    };

    const response = await request(app)
      .patch(`/internal/api/v1/admin/users/${anotherUser.id}`)
      .set('Authorization', token)
      .send(anotherUserUpdatedData)
      .expect(200);

    const refetchedAnotherUser = await anotherUser.$query();

    const expectedPayload = updateUserMock(
      {
        ...refetchedAnotherUser,
        ...anotherUserUpdatedData,
      },
      anotherRole
    );

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return HTTP 422 with invalid user data', async () => {
    const anotherUser = await createUser();

    const anotherUserUpdatedData = {
      email: null,
      fullName: null,
      roleId: null,
    };

    const response = await request(app)
      .patch(`/internal/api/v1/admin/users/${anotherUser.id}`)
      .set('Authorization', token)
      .send(anotherUserUpdatedData)
      .expect(422);

    expect(response.body.meta.type).toStrictEqual('ModelValidation');

    expect(response.body.errors).toMatchObject({
      email: ['must be string'],
      fullName: ['must be string'],
      roleId: ['must be string'],
    });
  });

  it('should return not found response for not existing user UUID', async () => {
    const notExistingUserUUID = Crypto.randomUUID();

    await request(app)
      .patch(`/internal/api/v1/admin/users/${notExistingUserUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .patch('/internal/api/v1/admin/users/invalidUserUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
