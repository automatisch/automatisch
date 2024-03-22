import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import getAppAuthClientMock from '../../../../../test/mocks/rest/api/v1/app-auth-clients/get-app-auth-client.js';
import { createAppAuthClient } from '../../../../../test/factories/app-auth-client.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/app-auth-clients/:id', () => {
  let currentUser, currentAppAuthClient, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();
    currentAppAuthClient = await createAppAuthClient();

    token = createAuthTokenByUserId(currentUser.id);
  });

  it('should return specified app auth client info', async () => {
    const response = await request(app)
      .get(`/api/v1/app-auth-clients/${currentAppAuthClient.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAppAuthClientMock(currentAppAuthClient);
    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response for not existing app auth client ID', async () => {
    const notExistingAppAuthClientUUID = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/app-auth-clients/${notExistingAppAuthClientUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .get('/api/v1/app-auth-clients/invalidAppAuthClientUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
