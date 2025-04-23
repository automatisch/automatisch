import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import ApiToken from '../../../../../../models/api-token.ee.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import createApiTokenMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/api-tokens/create-api-token.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('POST /internal/api/v1/admin/api-tokens', () => {
  let currentUser, token, role;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    role = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the created api token', async () => {
    const response = await request(app)
      .post('/internal/api/v1/admin/api-tokens')
      .set('Authorization', token)
      .expect(201);

    const refetchedToken = await ApiToken.query().findById(
      response.body.data.id
    );

    const expectedPayload = await createApiTokenMock(refetchedToken);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
