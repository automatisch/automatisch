import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../test/factories/role.js';
import createAppAuthClientMock from '../../../../../../test/mocks/rest/api/v1/admin/apps/create-auth-client.js';
import { createAppConfig } from '../../../../../../test/factories/app-config.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('POST /api/v1/admin/apps/:appKey/auth-clients', () => {
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

    const appAuthClient = {
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
      .post('/api/v1/admin/apps/gitlab/auth-clients')
      .set('Authorization', token)
      .send(appAuthClient)
      .expect(201);

    const expectedPayload = createAppAuthClientMock(appAuthClient);
    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return not found response for not existing app config', async () => {
    const appAuthClient = {
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
      .post('/api/v1/admin/apps/gitlab/auth-clients')
      .set('Authorization', token)
      .send(appAuthClient)
      .expect(404);
  });

  it('should return bad request response for missing required fields', async () => {
    await createAppConfig({
      key: 'gitlab',
    });

    const appAuthClient = {
      appKey: 'gitlab',
    };

    const response = await request(app)
      .post('/api/v1/admin/apps/gitlab/auth-clients')
      .set('Authorization', token)
      .send(appAuthClient)
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
