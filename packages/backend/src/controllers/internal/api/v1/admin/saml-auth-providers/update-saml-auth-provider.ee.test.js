import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import { createSamlAuthProvider } from '../../../../../../../test/factories/saml-auth-provider.ee.js';
import createSamlAuthProviderMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/saml-auth-providers/create-saml-auth-provider.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('PATCH /internal/api/v1/admin/saml-auth-provider/:samlAuthProviderId', () => {
  let currentUser, token, role;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    role = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the updated saml auth provider', async () => {
    const samlAuthProviderPayload = {
      active: true,
      name: 'Name',
      issuer: 'theclientid',
      certificate: 'dummycert',
      entryPoint: 'http://localhost:8080/realms/automatisch/protocol/saml',
      signatureAlgorithm: 'sha256',
      defaultRoleId: role.id,
      firstnameAttributeName: 'urn:oid:2.5.4.42',
      surnameAttributeName: 'urn:oid:2.5.4.4',
      emailAttributeName: 'urn:oid:1.2.840.113549.1.9.1',
      roleAttributeName: 'Role',
    };

    const samlAuthProvider = await createSamlAuthProvider(
      samlAuthProviderPayload
    );

    const response = await request(app)
      .patch(
        `/internal/api/v1/admin/saml-auth-providers/${samlAuthProvider.id}`
      )
      .set('Authorization', token)
      .send({
        active: false,
        name: 'Archived',
      })
      .expect(200);

    const refetchedSamlAuthProvider = await samlAuthProvider.$query();

    const expectedPayload = await createSamlAuthProviderMock({
      ...refetchedSamlAuthProvider,
      name: 'Archived',
      active: false,
    });

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return unprocessable entity response for invalid data', async () => {
    const samlAuthProviderPayload = {
      active: true,
      name: 'Name',
      issuer: 'theclientid',
      certificate: 'dummycert',
      entryPoint: 'http://localhost:8080/realms/automatisch/protocol/saml',
      signatureAlgorithm: 'sha256',
      defaultRoleId: role.id,
      firstnameAttributeName: 'urn:oid:2.5.4.42',
      surnameAttributeName: 'urn:oid:2.5.4.4',
      emailAttributeName: 'urn:oid:1.2.840.113549.1.9.1',
      roleAttributeName: 'Role',
    };

    const samlAuthProvider = await createSamlAuthProvider(
      samlAuthProviderPayload
    );

    const response = await request(app)
      .patch(
        `/internal/api/v1/admin/saml-auth-providers/${samlAuthProvider.id}`
      )
      .set('Authorization', token)
      .send({
        active: 'true',
        name: 123,
        roleAttributeName: 123,
      })
      .expect(422);

    expect(response.body).toStrictEqual({
      errors: {
        name: ['must be string'],
        active: ['must be boolean'],
        roleAttributeName: ['must be string'],
      },
      meta: { type: 'ModelValidation' },
    });
  });

  it('should return not found response for not existing SAML auth provider UUID', async () => {
    const notExistingSamlAuthProviderUUID = Crypto.randomUUID();

    await request(app)
      .patch(
        `/internal/api/v1/admin/saml-auth-providers/${notExistingSamlAuthProviderUUID}`
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .patch(
        '/internal/api/v1/admin/saml-auth-providers/invalidSamlAuthProviderUUID'
      )
      .set('Authorization', token)
      .expect(400);
  });
});
