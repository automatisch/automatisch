import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createRole } from '../../../../../test/factories/role.js';
import { createUser } from '../../../../../test/factories/user.js';
import getUserInvitationsMock from '../../../../../test/mocks/rest/api/v1/user-invitations/get-user-invitations.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/user-invitations', () => {
  let userOne, userOneRole, userTwo, userTwoRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    userOneRole = await createRole({ name: 'Admin' });

    userOne = await createUser({
      roleId: userOneRole.id,
      fullName: 'User 1',
      status: 'invited',
    });

    userTwoRole = await createRole({
      name: 'Another user role',
    });

    userTwo = await createUser({
      roleId: userTwoRole.id,
      fullName: 'User 2',
      status: 'invited',
    });

    token = (await createApiToken()).token;
  });

  it('should return user invitations data', async () => {
    const response = await request(app)
      .get('/api/v1/user-invitations')
      .set('x-api-token', token)
      .expect(200);

    const expectedResponsePayload = await getUserInvitationsMock(
      [userOne, userTwo],
      [userOneRole, userTwoRole]
    );

    expect(response.body).toStrictEqual(expectedResponsePayload);
  });
});
