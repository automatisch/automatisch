import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../test/factories/user.js';
import getRolesMock from '../../../../../../test/mocks/rest/api/v1/admin/roles/get-roles.ee.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /api/v1/admin/roles', () => {
  let roleOne, roleTwo, currentUser, token;

  beforeEach(async () => {
    roleOne = await createRole({ key: 'admin' });
    roleTwo = await createRole({ key: 'user' });
    currentUser = await createUser({ roleId: roleOne.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return roles', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    const response = await request(app)
      .get('/api/v1/admin/roles')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getRolesMock([roleOne, roleTwo]);

    expect(response.body).toEqual(expectedPayload);
  });
});
