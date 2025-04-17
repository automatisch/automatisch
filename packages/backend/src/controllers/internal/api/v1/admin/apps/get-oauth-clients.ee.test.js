import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import getAdminOAuthClientsMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/apps/get-oauth-clients.js';
import { createOAuthClient } from '../../../../../../../test/factories/oauth-client.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('GET /internal/api/v1/admin/apps/:appKey/oauth-clients', () => {
  let currentUser, adminRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return specified oauth client info', async () => {
    const oauthClientOne = await createOAuthClient({
      appKey: 'deepl',
    });

    const oauthClientTwo = await createOAuthClient({
      appKey: 'deepl',
    });

    const response = await request(app)
      .get('/internal/api/v1/admin/apps/deepl/oauth-clients')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAdminOAuthClientsMock([
      oauthClientTwo,
      oauthClientOne,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
