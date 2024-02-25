import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import getAdminAppAuthClientMock from '../../../../../../test/mocks/rest/api/v1/admin/get-app-auth-client.js';
import { createAppAuthClient } from '../../../../../../test/factories/app-auth-client.js';
import { createRole } from '../../../../../../test/factories/role.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /api/v1/admin/app-auth-clients/:appAuthClientId', () => {
  let currentUser, currentUserRole, currentAppAuthClient, token;

  describe('with valid license key', () => {
    beforeEach(async () => {
      vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

      currentUserRole = await createRole({ key: 'admin' });
      currentUser = await createUser({ roleId: currentUserRole.id });
      currentAppAuthClient = await createAppAuthClient();

      token = createAuthTokenByUserId(currentUser.id);
    });

    it('should return specified app auth client info', async () => {
      const response = await request(app)
        .get(`/api/v1/admin/app-auth-clients/${currentAppAuthClient.id}`)
        .set('Authorization', token)
        .expect(200);

      const expectedPayload = getAdminAppAuthClientMock(currentAppAuthClient);
      expect(response.body).toEqual(expectedPayload);
    });
  });
});
