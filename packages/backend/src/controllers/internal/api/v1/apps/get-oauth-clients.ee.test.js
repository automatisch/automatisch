import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import getOAuthClientsMock from '../../../../../../test/mocks/rest/internal/api/v1/apps/get-oauth-clients.js';
import { createOAuthClient } from '../../../../../../test/factories/oauth-client.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /internal/api/v1/apps/:appKey/oauth-clients', () => {
  let currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return specified oauth client info', async () => {
    const oauthClientOne = await createOAuthClient({
      appKey: 'deepl',
    });

    const oauthClientTwo = await createOAuthClient({
      appKey: 'deepl',
    });

    const response = await request(app)
      .get('/internal/api/v1/apps/deepl/oauth-clients')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getOAuthClientsMock([
      oauthClientTwo,
      oauthClientOne,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
