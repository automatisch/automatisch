import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../test/factories/role.js';
import updateAppAuthClientMock from '../../../../../../test/mocks/rest/api/v1/admin/apps/update-auth-client.js';
import { createAppConfig } from '../../../../../../test/factories/app-config.js';
import { createAppAuthClient } from '../../../../../../test/factories/app-auth-client.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('PATCH /api/v1/admin/apps/:appKey/auth-clients', () => {
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

  it('should return updated entity for valid app auth client', async () => {
    const appAuthClient = {
      active: true,
      appKey: 'gitlab',
      formattedAuthDefaults: {
        clientid: 'sample client ID',
        clientSecret: 'sample client secret',
        instanceUrl: 'https://gitlab.com',
        oAuthRedirectUrl: 'http://localhost:3001/app/gitlab/connection/add',
      },
    };

    const existingAppAuthClient = await createAppAuthClient({
      appKey: 'gitlab',
      name: 'First auth client',
    });

    const response = await request(app)
      .patch(
        `/api/v1/admin/apps/gitlab/auth-clients/${existingAppAuthClient.id}`
      )
      .set('Authorization', token)
      .send(appAuthClient)
      .expect(200);

    const expectedPayload = updateAppAuthClientMock({
      ...existingAppAuthClient,
      ...appAuthClient,
    });

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return not found response for not existing app auth client', async () => {
    const notExistingAppAuthClientId = Crypto.randomUUID();

    await request(app)
      .patch(
        `/api/v1/admin/apps/gitlab/auth-clients/${notExistingAppAuthClientId}`
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .patch('/api/v1/admin/apps/gitlab/auth-clients/invalidAuthClientUUID')
      .set('Authorization', token)
      .expect(400);
  });

  it('should return HTTP 422 for invalid payload', async () => {
    const appAuthClient = {
      formattedAuthDefaults: 'invalid input',
    };

    const existingAppAuthClient = await createAppAuthClient({
      appKey: 'gitlab',
      name: 'First auth client',
    });

    const response = await request(app)
      .patch(
        `/api/v1/admin/apps/gitlab/auth-clients/${existingAppAuthClient.id}`
      )
      .set('Authorization', token)
      .send(appAuthClient)
      .expect(422);

    expect(response.body.meta.type).toBe('ModelValidation');
    expect(response.body.errors).toMatchObject({
      formattedAuthDefaults: ['must be object'],
    });
  });
});
