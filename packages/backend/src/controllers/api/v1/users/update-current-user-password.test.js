import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import updateCurrentUserPasswordMock from '../../../../../test/mocks/rest/api/v1/users/update-current-user-password.js';

describe('PATCH /api/v1/users/:userId/password', () => {
  let currentUser, token;

  beforeEach(async () => {
    currentUser = await createUser();
    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return updated user with valid password', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${currentUser.id}/password`)
      .set('Authorization', token)
      .send({ password: 'new-password' })
      .expect(200);

    const refetchedCurrentUser = await currentUser.$query();
    const expectedPayload = updateCurrentUserPasswordMock(refetchedCurrentUser);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return HTTP 422 with invalid password', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${currentUser.id}/password`)
      .set('Authorization', token)
      .send({ password: '' })
      .expect(422);

    expect(response.body.meta.type).toEqual('ModelValidation');
    expect(response.body.errors).toMatchObject({
      password: ['must NOT have fewer than 6 characters'],
    });
  });
});
