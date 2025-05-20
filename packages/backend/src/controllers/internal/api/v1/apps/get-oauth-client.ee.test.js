import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import getOAuthClientMock from '../../../../../../test/mocks/rest/internal/api/v1/apps/get-oauth-client.js';
import { createOAuthClient } from '../../../../../../test/factories/oauth-client.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /internal/api/v1/apps/:appKey/oauth-clients/:oauthClientId', () => {
  let currentUser, currentOAuthClient, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();
    currentOAuthClient = await createOAuthClient({
      appKey: 'deepl',
    });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return specified oauth client', async () => {
    const response = await request(app)
      .get(`/internal/api/v1/apps/deepl/oauth-clients/${currentOAuthClient.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getOAuthClientMock(currentOAuthClient);
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing oauth client ID', async () => {
    const notExistingOAuthClientUUID = Crypto.randomUUID();

    await request(app)
      .get(
        `/internal/api/v1/apps/deepl/oauth-clients/${notExistingOAuthClientUUID}`
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .get('/internal/api/v1/apps/deepl/oauth-clients/invalidOAuthClientUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
