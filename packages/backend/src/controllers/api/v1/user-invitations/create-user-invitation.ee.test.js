import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createRole } from '../../../../../test/factories/role.js';
import { createUser } from '../../../../../test/factories/user.js';
import createUserMock from '../../../../../test/mocks/rest/api/v1/user-invitations/create-user-invitation.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';
import User from '../../../../models/user.js';

describe('POST /api/v1/user-invitations', () => {
  let token, roleId;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    roleId = (await createRole({ name: 'User' })).id;
    token = (await createApiToken()).token;
  });

  it('should return created user with valid data', async () => {
    const userData = {
      email: 'created@sample.com',
      fullName: 'Full Name',
      password: 'samplePassword123',
      roleId,
    };

    const response = await request(app)
      .post('/api/v1/user-invitations')
      .set('x-api-token', token)
      .send(userData)
      .expect(201);

    const refetchedRegisteredUser = await User.query()
      .findById(response.body.data.id)
      .throwIfNotFound();

    const expectedPayload = createUserMock(refetchedRegisteredUser);

    expect(response.body).toStrictEqual(expectedPayload);
    expect(refetchedRegisteredUser.roleId).toStrictEqual(roleId);
  });

  it('should return unprocessable entity response with already used email', async () => {
    await createUser({
      email: 'created@sample.com',
    });

    const userData = {
      email: 'created@sample.com',
      fullName: 'Full Name',
      password: 'samplePassword123',
      roleId,
    };

    const response = await request(app)
      .post('/api/v1/user-invitations')
      .set('x-api-token', token)
      .send(userData)
      .expect(422);

    expect(response.body.errors).toStrictEqual({
      email: ["'email' must be unique."],
    });

    expect(response.body.meta).toStrictEqual({
      type: 'UniqueViolationError',
    });
  });

  it('should return unprocessable entity response with invalid user data', async () => {
    const userData = {
      email: null,
      fullName: null,
      roleId: null,
    };

    const response = await request(app)
      .post('/api/v1/user-invitations')
      .set('x-api-token', token)
      .send(userData)
      .expect(422);

    expect(response.body.meta.type).toStrictEqual('ModelValidation');
    expect(response.body.errors).toStrictEqual({
      email: ["must have required property 'email'"],
      fullName: ['must be string'],
      roleId: ['must be string'],
    });
  });
});
