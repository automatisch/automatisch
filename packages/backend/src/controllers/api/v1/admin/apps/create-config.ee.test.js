import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../test/factories/role.js';
import createAppConfigMock from '../../../../../../test/mocks/rest/api/v1/admin/apps/create-config.js';
import { createAppConfig } from '../../../../../../test/factories/app-config.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('POST /api/v1/admin/apps/:appKey/config', () => {
  let currentUser, adminRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return created app config', async () => {
    const appConfig = {
      customConnectionAllowed: true,
      shared: true,
      disabled: false,
    };

    const response = await request(app)
      .post('/api/v1/admin/apps/gitlab/config')
      .set('Authorization', token)
      .send(appConfig)
      .expect(201);

    const expectedPayload = createAppConfigMock({
      ...appConfig,
      key: 'gitlab',
    });
    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return HTTP 422 for already existing app config', async () => {
    const appConfig = {
      key: 'gitlab',
      customConnectionAllowed: true,
      shared: true,
      disabled: false,
    };

    await createAppConfig(appConfig);

    const response = await request(app)
      .post('/api/v1/admin/apps/gitlab/config')
      .set('Authorization', token)
      .send({
        disabled: false,
      })
      .expect(422);

    expect(response.body.meta.type).toEqual('UniqueViolationError');
    expect(response.body.errors).toMatchObject({
      key: ["'key' must be unique."],
    });
  });
});
