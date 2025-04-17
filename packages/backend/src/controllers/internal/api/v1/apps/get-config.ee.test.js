import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import getAppConfigMock from '../../../../../../test/mocks/rest/internal/api/v1/apps/get-config.js';
import { createAppConfig } from '../../../../../../test/factories/app-config.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /internal/api/v1/apps/:appKey/config', () => {
  let currentUser, appConfig, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();

    appConfig = await createAppConfig({
      key: 'deepl',
      useOnlyPredefinedAuthClients: false,
      disabled: false,
    });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return specified app config info', async () => {
    const response = await request(app)
      .get(`/internal/api/v1/apps/${appConfig.key}/config`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAppConfigMock(appConfig);
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing app key', async () => {
    await request(app)
      .get('/internal/api/v1/apps/not-existing-app-key/config')
      .set('Authorization', token)
      .expect(404);
  });
});
