import Crypto from 'node:crypto';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createSamlAuthProvider } from '../../../../../../../test/factories/saml-auth-provider.ee.js';
import { createRoleMapping } from '../../../../../../../test/factories/role-mapping.js';
import createRoleMappingsMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/saml-auth-providers/update-role-mappings.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('PATCH /internal/api/v1/admin/saml-auth-providers/:samlAuthProviderId/role-mappings', () => {
  let samlAuthProvider, currentUser, userRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    userRole = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: userRole.id });

    samlAuthProvider = await createSamlAuthProvider();

    await createRoleMapping({
      samlAuthProviderId: samlAuthProvider.id,
      remoteRoleName: 'Viewer',
    });

    await createRoleMapping({
      samlAuthProviderId: samlAuthProvider.id,
      remoteRoleName: 'Editor',
    });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should update role mappings', async () => {
    const roleMappings = [
      {
        roleId: userRole.id,
        remoteRoleName: 'Admin',
      },
    ];

    const response = await request(app)
      .patch(
        `/internal/api/v1/admin/saml-auth-providers/${samlAuthProvider.id}/role-mappings`
      )
      .set('Authorization', token)
      .send(roleMappings)
      .expect(200);

    const expectedPayload = await createRoleMappingsMock([
      {
        roleId: userRole.id,
        remoteRoleName: 'Admin',
        id: response.body.data[0].id,
        samlAuthProviderId: samlAuthProvider.id,
      },
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should delete role mappings when given empty role mappings', async () => {
    const existingRoleMappings = await samlAuthProvider.$relatedQuery(
      'roleMappings'
    );

    expect(existingRoleMappings.length).toBe(2);

    const response = await request(app)
      .patch(
        `/internal/api/v1/admin/saml-auth-providers/${samlAuthProvider.id}/role-mappings`
      )
      .set('Authorization', token)
      .send([])
      .expect(200);

    const expectedPayload = await createRoleMappingsMock([]);

    expect(response.body).toStrictEqual({
      ...expectedPayload,
      meta: {
        ...expectedPayload.meta,
        type: 'Object',
      },
    });
  });

  it('should return internal server error response for not existing role UUID', async () => {
    const notExistingRoleUUID = Crypto.randomUUID();
    const roleMappings = [
      {
        roleId: notExistingRoleUUID,
        remoteRoleName: 'Admin',
      },
    ];

    await request(app)
      .patch(
        `/internal/api/v1/admin/saml-auth-providers/${samlAuthProvider.id}/role-mappings`
      )
      .set('Authorization', token)
      .send(roleMappings)
      .expect(500);
  });

  it('should return unprocessable entity response for invalid data', async () => {
    const roleMappings = [
      {
        roleId: userRole.id,
        remoteRoleName: {},
      },
    ];

    const response = await request(app)
      .patch(
        `/internal/api/v1/admin/saml-auth-providers/${samlAuthProvider.id}/role-mappings`
      )
      .set('Authorization', token)
      .send(roleMappings)
      .expect(422);

    expect(response.body).toStrictEqual({
      errors: {
        remoteRoleName: ['must be string'],
      },
      meta: {
        type: 'ModelValidation',
      },
    });
  });

  it('should return not found response for not existing SAML auth provider UUID', async () => {
    const notExistingSamlAuthProviderUUID = Crypto.randomUUID();
    const roleMappings = [
      {
        roleId: userRole.id,
        remoteRoleName: 'Admin',
      },
    ];

    await request(app)
      .patch(
        `/internal/api/v1/admin/saml-auth-providers/${notExistingSamlAuthProviderUUID}/role-mappings`
      )
      .set('Authorization', token)
      .send(roleMappings)
      .expect(404);
  });
});
