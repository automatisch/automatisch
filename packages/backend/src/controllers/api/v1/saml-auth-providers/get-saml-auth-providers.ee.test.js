import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createPermission } from '../../../../../test/factories/permission.js';
import { createSamlAuthProvider } from '../../../../../test/factories/saml-auth-provider.ee.js';
import getSamlAuthProvidersMock from '../../../../../test/mocks/rest/api/v1/saml-auth-providers/get-saml-auth-providers.ee.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/saml-auth-providers', () => {
  let samlAuthProviderOne, samlAuthProviderTwo, currentUser, token;

  beforeEach(async () => {
    currentUser = await createUser();
    const role = await currentUser.$relatedQuery('role');

    await createPermission({
      roleId: role.id,
      action: 'read',
      subject: 'SamlAuthProvider',
      conditions: [],
    });

    samlAuthProviderOne = await createSamlAuthProvider();
    samlAuthProviderTwo = await createSamlAuthProvider();

    token = createAuthTokenByUserId(currentUser.id);
  });

  it('should return saml auth providers', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    const response = await request(app)
      .get('/api/v1/saml-auth-providers')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getSamlAuthProvidersMock([
      samlAuthProviderTwo,
      samlAuthProviderOne,
    ]);

    expect(response.body).toEqual(expectedPayload);
  });
});
