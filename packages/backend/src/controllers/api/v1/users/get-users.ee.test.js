import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createRole } from '../../../../../test/factories/role.js';
import { createUser } from '../../../../../test/factories/user.js';
import getUsersMock from '../../../../../test/mocks/rest/internal/api/v1/admin/users/get-users.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/users', () => {
  let userOne, userOneRole, userTwo, userTwoRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    userOneRole = await createRole({ name: 'Admin' });

    userOne = await createUser({
      roleId: userOneRole.id,
      fullName: 'User 1',
    });

    userTwoRole = await createRole({
      name: 'Another user role',
    });

    userTwo = await createUser({
      roleId: userTwoRole.id,
      fullName: 'User 2',
    });

    await createUser({
      fullName: 'User 3',
      status: 'invited',
    });

    token = (await createApiToken()).token;
  });

  it('should return users data', async () => {
    const response = await request(app)
      .get('/api/v1/users')
      .set('x-api-token', token)
      .expect(200);

    const expectedResponsePayload = await getUsersMock(
      [userOne, userTwo],
      [userOneRole, userTwoRole]
    );

    expect(response.body).toStrictEqual(expectedResponsePayload);
  });

  it('should return users data without soft deleted users', async () => {
    const user = await createUser({
      fullName: 'User 3',
    });

    await user.$query().delete();

    const response = await request(app)
      .get('/api/v1/users')
      .set('x-api-token', token)
      .expect(200);

    const expectedResponsePayload = await getUsersMock(
      [userOne, userTwo],
      [userOneRole, userTwoRole]
    );

    expect(response.body).toStrictEqual(expectedResponsePayload);
  });
});
