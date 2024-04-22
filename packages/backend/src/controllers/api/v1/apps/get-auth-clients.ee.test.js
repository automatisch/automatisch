import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import getAuthClientsMock from '../../../../../test/mocks/rest/api/v1/apps/get-auth-clients.js';
import { createAppAuthClient } from '../../../../../test/factories/app-auth-client.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/apps/:appKey/auth-clients', () => {
  let currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return specified app auth client info', async () => {
    const appAuthClientOne = await createAppAuthClient({
      appKey: 'deepl',
    });

    const appAuthClientTwo = await createAppAuthClient({
      appKey: 'deepl',
    });

    const response = await request(app)
      .get('/api/v1/apps/deepl/auth-clients')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAuthClientsMock([
      appAuthClientTwo,
      appAuthClientOne,
    ]);

    expect(response.body).toEqual(expectedPayload);
  });
});
