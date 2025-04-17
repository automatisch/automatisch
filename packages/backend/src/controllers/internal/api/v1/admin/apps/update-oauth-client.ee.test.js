import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import updateOAuthClientMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/apps/update-oauth-client.js';
import { createAppConfig } from '../../../../../../../test/factories/app-config.js';
import { createOAuthClient } from '../../../../../../../test/factories/oauth-client.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('PATCH /internal/api/v1/admin/apps/:appKey/oauth-clients', () => {
  let currentUser, adminRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);

    await createAppConfig({
      key: 'gitlab',
    });
  });

  it('should return updated entity for valid oauth client', async () => {
    const oauthClient = {
      active: true,
      appKey: 'gitlab',
      formattedAuthDefaults: {
        clientid: 'sample client ID',
        clientSecret: 'sample client secret',
        instanceUrl: 'https://gitlab.com',
        oAuthRedirectUrl: 'http://localhost:3001/app/gitlab/connection/add',
      },
    };

    const existingOAuthClient = await createOAuthClient({
      appKey: 'gitlab',
      name: 'First auth client',
    });

    const response = await request(app)
      .patch(
        `/internal/api/v1/admin/apps/gitlab/oauth-clients/${existingOAuthClient.id}`
      )
      .set('Authorization', token)
      .send(oauthClient)
      .expect(200);

    const expectedPayload = updateOAuthClientMock({
      ...existingOAuthClient,
      ...oauthClient,
    });

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return not found response for not existing oauth client', async () => {
    const notExistingOAuthClientId = Crypto.randomUUID();

    await request(app)
      .patch(
        `/internal/api/v1/admin/apps/gitlab/oauth-clients/${notExistingOAuthClientId}`
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .patch(
        '/internal/api/v1/admin/apps/gitlab/oauth-clients/invalidAuthClientUUID'
      )
      .set('Authorization', token)
      .expect(400);
  });

  it('should return HTTP 422 for invalid payload', async () => {
    const oauthClient = {
      formattedAuthDefaults: 'invalid input',
    };

    const existingOAuthClient = await createOAuthClient({
      appKey: 'gitlab',
      name: 'First auth client',
    });

    const response = await request(app)
      .patch(
        `/internal/api/v1/admin/apps/gitlab/oauth-clients/${existingOAuthClient.id}`
      )
      .set('Authorization', token)
      .send(oauthClient)
      .expect(422);

    expect(response.body.meta.type).toBe('ModelValidation');
    expect(response.body.errors).toMatchObject({
      formattedAuthDefaults: ['must be object'],
    });
  });
});
