import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../test/factories/role.js';
import createAppConfigMock from '../../../../../../test/mocks/rest/api/v1/admin/apps/create-config.js';
import { createAppConfig } from '../../../../../../test/factories/app-config.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('PATCH /api/v1/admin/apps/:appKey/config', () => {
  let currentUser, adminRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return updated app config', async () => {
    const appConfig = {
      key: 'gitlab',
      customConnectionAllowed: true,
      shared: true,
      disabled: false,
    };

    await createAppConfig(appConfig);

    const newAppConfigValues = {
      shared: false,
      disabled: true,
      customConnectionAllowed: false,
    };

    const response = await request(app)
      .patch('/api/v1/admin/apps/gitlab/config')
      .set('Authorization', token)
      .send(newAppConfigValues)
      .expect(200);

    const expectedPayload = createAppConfigMock({
      ...newAppConfigValues,
      key: 'gitlab',
    });

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return not found response for unexisting app config', async () => {
    const appConfig = {
      shared: false,
      disabled: true,
      customConnectionAllowed: false,
    };

    await request(app)
      .patch('/api/v1/admin/apps/gitlab/config')
      .set('Authorization', token)
      .send(appConfig)
      .expect(404);
  });

  it('should return HTTP 422 for invalid app config data', async () => {
    const appConfig = {
      key: 'gitlab',
      customConnectionAllowed: true,
      shared: true,
      disabled: false,
    };

    await createAppConfig(appConfig);

    const response = await request(app)
      .patch('/api/v1/admin/apps/gitlab/config')
      .set('Authorization', token)
      .send({
        disabled: 'invalid value type',
      })
      .expect(422);

    expect(response.body.meta.type).toEqual('ModelValidation');
    expect(response.body.errors).toMatchObject({
      disabled: ['must be boolean'],
    });
  });
});
