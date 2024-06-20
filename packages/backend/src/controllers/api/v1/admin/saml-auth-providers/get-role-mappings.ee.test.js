import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createSamlAuthProvider } from '../../../../../../test/factories/saml-auth-provider.ee.js';
import { createRoleMapping } from '../../../../../../test/factories/role-mapping.js';
import getRoleMappingsMock from '../../../../../../test/mocks/rest/api/v1/admin/saml-auth-providers/get-role-mappings.ee.js';
import * as license from '../../../../../helpers/license.ee.js';

describe('GET /api/v1/admin/saml-auth-providers/:samlAuthProviderId/role-mappings', () => {
  let roleMappingOne, roleMappingTwo, samlAuthProvider, currentUser, token;

  beforeEach(async () => {
    const role = await createRole({ key: 'admin' });
    currentUser = await createUser({ roleId: role.id });

    samlAuthProvider = await createSamlAuthProvider();

    roleMappingOne = await createRoleMapping({
      samlAuthProviderId: samlAuthProvider.id,
      remoteRoleName: 'Admin',
    });

    roleMappingTwo = await createRoleMapping({
      samlAuthProviderId: samlAuthProvider.id,
      remoteRoleName: 'User',
    });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return role mappings', async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    const response = await request(app)
      .get(
        `/api/v1/admin/saml-auth-providers/${samlAuthProvider.id}/role-mappings`
      )
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getRoleMappingsMock([
      roleMappingOne,
      roleMappingTwo,
    ]);

    expect(response.body).toEqual(expectedPayload);
  });
});
