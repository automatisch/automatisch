import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import getAppAuthClientsMock from '../../../../../test/mocks/rest/api/v1/app-auth-clients/get-app-auth-clients.js';
import { createAppAuthClient } from '../../../../../test/factories/app-auth-client.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/app-auth-clients', () => {
  let currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();

    token = createAuthTokenByUserId(currentUser.id);
  });

  it('should return specified app auth client info', async () => {
    const appAuthClientOne = await createAppAuthClient();
    const appAuthClientTwo = await createAppAuthClient();

    const response = await request(app)
      .get('/api/v1/app-auth-clients')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAppAuthClientsMock([
      appAuthClientTwo,
      appAuthClientOne,
    ]);

    expect(response.body).toEqual(expectedPayload);
  });
});
