import { beforeEach, describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import User from '../../../../../models/user.js';
import appConfig from '../../../../../config/app.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../test/factories/role.js';
import registerUserMock from '../../../../../../test/mocks/rest/internal/api/v1/users/register-user.ee.js';

describe('POST /internal/api/v1/users/register', () => {
  beforeEach(async () => {
    vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
  });

  it('should return registered user with valid data', async () => {
    await createRole({ name: 'User' });

    const userData = {
      email: 'registered@sample.com',
      fullName: 'Full Name',
      password: 'samplePassword123',
    };

    const response = await request(app)
      .post('/internal/api/v1/users/register')
      .send(userData)
      .expect(201);

    const refetchedRegisteredUser = await User.query()
      .findById(response.body.data.id)
      .throwIfNotFound();

    const expectedPayload = registerUserMock(refetchedRegisteredUser);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response without user role existing', async () => {
    const userData = {
      email: 'registered@sample.com',
      fullName: 'Full Name',
      password: 'samplePassword123',
    };

    await request(app)
      .post('/internal/api/v1/users/register')
      .send(userData)
      .expect(404);
  });

  it('should return unprocessable entity response with already used email', async () => {
    await createRole({ name: 'User' });
    await createUser({
      email: 'registered@sample.com',
    });

    const userData = {
      email: 'registered@sample.com',
      fullName: 'Full Name',
      password: 'samplePassword123',
    };

    const response = await request(app)
      .post('/internal/api/v1/users/register')
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
    await createRole({ name: 'User' });

    const userData = {
      email: null,
      fullName: null,
    };

    const response = await request(app)
      .post('/internal/api/v1/users/register')
      .send(userData)
      .expect(422);

    expect(response.body.meta.type).toStrictEqual('ModelValidation');
    expect(response.body.errors).toStrictEqual({
      email: ['must be string'],
      fullName: ['must be string'],
    });
  });
});
