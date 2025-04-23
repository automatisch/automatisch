import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import updateCurrentUserPasswordMock from '../../../../../../test/mocks/rest/internal/api/v1/users/update-current-user-password.js';

describe('PATCH /internal/api/v1/users/:userId/password', () => {
  let currentUser, token;

  beforeEach(async () => {
    currentUser = await createUser({ password: 'old-password' });
    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return updated user with valid password', async () => {
    const userData = {
      currentPassword: 'old-password',
      password: 'new-password',
    };

    const response = await request(app)
      .patch(`/internal/api/v1/users/${currentUser.id}/password`)
      .set('Authorization', token)
      .send(userData)
      .expect(200);

    const refetchedCurrentUser = await currentUser.$query();
    const expectedPayload = updateCurrentUserPasswordMock(refetchedCurrentUser);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return HTTP 422 with invalid current password', async () => {
    const userData = {
      currentPassword: '',
      password: 'new-password',
    };

    const response = await request(app)
      .patch(`/internal/api/v1/users/${currentUser.id}/password`)
      .set('Authorization', token)
      .send(userData)
      .expect(422);

    expect(response.body.meta.type).toStrictEqual('ValidationError');
    expect(response.body.errors).toMatchObject({
      currentPassword: ['is incorrect.'],
    });
  });
});
