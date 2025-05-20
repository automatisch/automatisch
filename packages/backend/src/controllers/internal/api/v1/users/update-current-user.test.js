import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import updateCurrentUserMock from '../../../../../../test/mocks/rest/internal/api/v1/users/update-current-user.js';

describe('PATCH /internal/api/v1/users/:userId', () => {
  let currentUser, token;

  beforeEach(async () => {
    currentUser = await createUser();
    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return updated user with valid data', async () => {
    const userData = {
      email: 'updated@sample.com',
      fullName: 'Updated Full Name',
    };

    const response = await request(app)
      .patch(`/internal/api/v1/users/${currentUser.id}`)
      .set('Authorization', token)
      .send(userData)
      .expect(200);

    const refetchedCurrentUser = await currentUser.$query();

    const expectedPayload = updateCurrentUserMock({
      ...refetchedCurrentUser,
      ...userData,
    });

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return HTTP 422 with invalid user data', async () => {
    const userData = {
      email: null,
      fullName: null,
    };

    const response = await request(app)
      .patch(`/internal/api/v1/users/${currentUser.id}`)
      .set('Authorization', token)
      .send(userData)
      .expect(422);

    expect(response.body.meta.type).toStrictEqual('ModelValidation');

    expect(response.body.errors).toMatchObject({
      email: ['must be string'],
      fullName: ['must be string'],
    });
  });
});
