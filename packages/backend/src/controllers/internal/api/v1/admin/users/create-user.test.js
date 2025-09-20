import { describe, beforeEach, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import User from '@/models/user.js';
import Role from '@/models/role.js';
import { createUser } from '@/factories/user.js';
import { createRole } from '@/factories/role.js';
import createUserMock from '@/mocks/rest/internal/api/v1/admin/users/create-user.js';

describe('POST /internal/api/v1/admin/users', () => {
  let currentUser, adminRole, token;

  beforeEach(async () => {
    adminRole = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return created user with valid data', async () => {
    const userRole = await createRole({ name: 'User' });

    const userData = {
      email: 'created@sample.com',
      fullName: 'Full Name',
      password: 'samplePassword123',
      roleId: userRole.id,
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/users')
      .set('Authorization', token)
      .send(userData)
      .expect(201);

    const refetchedRegisteredUser = await User.query()
      .findById(response.body.data.id)
      .throwIfNotFound();

    const expectedPayload = createUserMock(refetchedRegisteredUser);

    expect(response.body).toStrictEqual(expectedPayload);
    expect(refetchedRegisteredUser.roleId).toStrictEqual(userRole.id);
  });

  it('should create user with admin role if there is no role id given', async () => {
    const userData = {
      email: 'created@sample.com',
      fullName: 'Full Name',
      password: 'samplePassword123',
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/users')
      .set('Authorization', token)
      .send(userData)
      .expect(201);

    const refetchedRegisteredUser = await User.query()
      .findById(response.body.data.id)
      .throwIfNotFound();

    const refetchedUserRole = await Role.query().findById(
      refetchedRegisteredUser.roleId
    );

    const expectedPayload = createUserMock(refetchedRegisteredUser);

    expect(response.body).toStrictEqual(expectedPayload);
    expect(refetchedUserRole.name).toStrictEqual('Admin');
  });

  it('should return unprocessable entity response with already used email', async () => {
    await createRole({ name: 'User' });

    await createUser({
      email: 'created@sample.com',
    });

    const userData = {
      email: 'created@sample.com',
      fullName: 'Full Name',
      password: 'samplePassword123',
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/users')
      .set('Authorization', token)
      .send(userData)
      .expect(422);

    expect(response.body.errors).toStrictEqual({
      email: ['A user with this email already exists.'],
    });

    expect(response.body.meta).toStrictEqual({
      type: 'ValidationError',
    });
  });

  it('should return unprocessable entity response when trying to create user with soft-deleted email', async () => {
    await createRole({ name: 'User' });

    const existingUser = await createUser({
      email: 'deleted@sample.com',
      fullName: 'Deleted User',
    });

    await existingUser.$query().patch({
      deletedAt: new Date().toISOString(),
    });

    const userData = {
      email: 'deleted@sample.com',
      fullName: 'New User',
      password: 'samplePassword123',
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/users')
      .set('Authorization', token)
      .send(userData)
      .expect(422);

    expect(response.body.errors).toStrictEqual({
      email: [
        'A user with this email was previously deleted. Please contact an administrator or use a different email address.',
      ],
    });

    expect(response.body.meta).toStrictEqual({
      type: 'ValidationError',
    });
  });

  it('should return unprocessable entity response when trying to create user with soft-deleted email (case insensitive)', async () => {
    await createRole({ name: 'User' });

    const existingUser = await createUser({
      email: 'deleted@sample.com',
      fullName: 'Deleted User',
    });

    await existingUser.$query().patch({
      deletedAt: new Date().toISOString(),
    });

    const userData = {
      fullName: 'New User',
      password: 'samplePassword123',
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/users')
      .set('Authorization', token)
      .send(userData)
      .expect(422);

    expect(response.body.errors).toStrictEqual({
      email: [
        'A user with this email was previously deleted. Please contact an administrator or use a different email address.',
      ],
    });

    expect(response.body.meta).toStrictEqual({
      type: 'ValidationError',
    });
  });

  it('should allow creating user with email that was never used before', async () => {
    const userRole = await createRole({ name: 'User' });

    const userData = {
      email: 'fresh@sample.com',
      fullName: 'Fresh User',
      password: 'samplePassword123',
      roleId: userRole.id,
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/users')
      .set('Authorization', token)
      .send(userData)
      .expect(201);

    const refetchedRegisteredUser = await User.query()
      .findById(response.body.data.id)
      .throwIfNotFound();

    expect(refetchedRegisteredUser.email).toBe('fresh@sample.com');
    expect(refetchedRegisteredUser.fullName).toBe('Fresh User');
    expect(refetchedRegisteredUser.deletedAt).toBeUndefined();
  });

  it('should return unprocessable entity response with invalid user data', async () => {
    await createRole({ name: 'User' });

    const userData = {
      email: null,
      fullName: null,
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/users')
      .set('Authorization', token)
      .send(userData)
      .expect(422);

    expect(response.body.meta.type).toStrictEqual('ModelValidation');
    expect(response.body.errors).toStrictEqual({
      email: ["must have required property 'email'"],
      fullName: ['must be string'],
    });
  });
});
