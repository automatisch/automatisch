import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../../app.js';
import createAuthTokenByUserId from '../../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../../test/factories/user.js';
import createSamlAuthProviderMock from '../../../../../../../test/mocks/rest/internal/api/v1/admin/saml-auth-providers/create-saml-auth-provider.ee.js';
import * as license from '../../../../../../helpers/license.ee.js';

describe('POST /internal/api/v1/admin/saml-auth-provider', () => {
  let currentUser, token, role;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    role = await createRole({ name: 'Admin' });
    currentUser = await createUser({ roleId: role.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the created saml auth provider', async () => {
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

    const response = await request(app)
      .post('/internal/api/v1/admin/saml-auth-providers')
      .set('Authorization', token)
      .send(samlAuthProviderPayload)
      .expect(201);

    const expectedPayload = await createSamlAuthProviderMock({
      id: response.body.data.id,
      ...samlAuthProviderPayload,
    });

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return unprocessable entity response for invalid data', async () => {
    const response = await request(app)
      .post('/internal/api/v1/admin/saml-auth-providers')
      .set('Authorization', token)
      .send({
        active: true,
        name: 'Name',
        issuer: 'theclientid',
        signatureAlgorithm: 'invalid',
        firstnameAttributeName: 'urn:oid:2.5.4.42',
        surnameAttributeName: 'urn:oid:2.5.4.4',
        emailAttributeName: 'urn:oid:1.2.840.113549.1.9.1',
        roleAttributeName: 123,
      })
      .expect(422);

    expect(response.body).toStrictEqual({
      errors: {
        certificate: ["must have required property 'certificate'"],
        entryPoint: ["must have required property 'entryPoint'"],
        defaultRoleId: ["must have required property 'defaultRoleId'"],
        signatureAlgorithm: ['must be equal to one of the allowed values'],
        roleAttributeName: ['must be string'],
      },
      meta: { type: 'ModelValidation' },
    });
  });
});
