import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createRole } from '../../../../../../test/factories/role.js';
import getAppAuthClientMock from '../../../../../../test/mocks/rest/api/v1/admin/apps/get-auth-client.js';
import { createAppAuthClient } from '../../../../../../test/factories/app-auth-client.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /api/v1/admin/apps/:appKey/auth-clients/:appAuthClientId', () => {
  let currentUser, adminRole, currentAppAuthClient, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    adminRole = await createRole({ key: 'admin' });
    currentUser = await createUser({ roleId: adminRole.id });

    currentAppAuthClient = await createAppAuthClient({
      appKey: 'deepl',
    });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return specified app auth client', async () => {
    const response = await request(app)
      .get(`/api/v1/admin/apps/deepl/auth-clients/${currentAppAuthClient.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAppAuthClientMock(currentAppAuthClient);
    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response for not existing app auth client ID', async () => {
    const notExistingAppAuthClientUUID = Crypto.randomUUID();

    await request(app)
      .get(
        `/api/v1/admin/apps/deepl/auth-clients/${notExistingAppAuthClientUUID}`
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .get('/api/v1/admin/apps/deepl/auth-clients/invalidAppAuthClientUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
