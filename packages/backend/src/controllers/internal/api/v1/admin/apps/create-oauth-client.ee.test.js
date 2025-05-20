import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import createOAuthClientMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/apps/create-oauth-client.js';
import { createAppConfig } from '../../../../../../../test/factories/app-config.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('POST /internal/api/v1/admin/apps/:appKey/oauth-clients', () => {
  let currentUser, adminRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return created response for valid app config', async () => {
    await createAppConfig({
      key: 'gitlab',
    });

    const oauthClient = {
      active: true,
      appKey: 'gitlab',
      name: 'First auth client',
      formattedAuthDefaults: {
        clientid: 'sample client ID',
        clientSecret: 'sample client secret',
        instanceUrl: 'https://gitlab.com',
        oAuthRedirectUrl: 'http://localhost:3001/app/gitlab/connection/add',
      },
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/apps/gitlab/oauth-clients')
      .set('Authorization', token)
      .send(oauthClient)
      .expect(201);

    const expectedPayload = createOAuthClientMock(oauthClient);
    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should throw validation error for app that does not support oauth connections', async () => {
    await createAppConfig({
      key: 'deepl',
    });

    const oauthClient = {
      active: true,
      appKey: 'deepl',
      name: 'First auth client',
      formattedAuthDefaults: {
        clientid: 'sample client ID',
        clientSecret: 'sample client secret',
        instanceUrl: 'https://deepl.com',
        oAuthRedirectUrl: 'http://localhost:3001/app/deepl/connection/add',
      },
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/apps/deepl/oauth-clients')
      .set('Authorization', token)
      .send(oauthClient)
      .expect(422);

    expect(response.body.errors).toMatchObject({
      app: ['This app does not support OAuth clients!'],
    });
  });

  it('should return not found response for not existing app config', async () => {
    const oauthClient = {
      active: true,
      appKey: 'gitlab',
      name: 'First auth client',
      formattedAuthDefaults: {
        clientid: 'sample client ID',
        clientSecret: 'sample client secret',
        instanceUrl: 'https://gitlab.com',
        oAuthRedirectUrl: 'http://localhost:3001/app/gitlab/connection/add',
      },
    };

    await request(app)
      .post('/internal/api/v1/admin/apps/gitlab/oauth-clients')
      .set('Authorization', token)
      .send(oauthClient)
      .expect(404);
  });

  it('should return bad request response for missing required fields', async () => {
    await createAppConfig({
      key: 'gitlab',
    });

    const oauthClient = {
      appKey: 'gitlab',
    };

    const response = await request(app)
      .post('/internal/api/v1/admin/apps/gitlab/oauth-clients')
      .set('Authorization', token)
      .send(oauthClient)
      .expect(422);

    expect(response.body.meta.type).toStrictEqual('ModelValidation');
    expect(response.body.errors).toMatchObject({
      name: ["must have required property 'name'"],
      formattedAuthDefaults: [
        "must have required property 'formattedAuthDefaults'",
      ],
    });
  });
});
