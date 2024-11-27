import { vi, beforeEach, describe, it, expect } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import SamlAuthProvider from '../models/saml-auth-provider.ee';
import RoleMapping from '../models/role-mapping.ee';
import axios from '../helpers/axios-with-proxy.js';
import Identity from './identity.ee';
import Base from './base';
import appConfig from '../config/app';
import { createSamlAuthProvider } from '../../test/factories/saml-auth-provider.ee.js';
import { createRoleMapping } from '../../test/factories/role-mapping.js';
import { createRole } from '../../test/factories/role.js';

describe('SamlAuthProvider model', () => {
  it('tableName should return correct name', () => {
    expect(SamlAuthProvider.tableName).toBe('saml_auth_providers');
  });

  it('jsonSchema should have the correct schema', () => {
    expect(SamlAuthProvider.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = SamlAuthProvider.relationMappings();

    const expectedRelations = {
      identities: {
        relation: Base.HasOneRelation,
        modelClass: Identity,
        join: {
          from: 'identities.provider_id',
          to: 'saml_auth_providers.id',
        },
      },
      roleMappings: {
        relation: Base.HasManyRelation,
        modelClass: RoleMapping,
        join: {
          from: 'saml_auth_providers.id',
          to: 'role_mappings.saml_auth_provider_id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  it('virtualAttributes should return correct attributes', () => {
    const virtualAttributes = SamlAuthProvider.virtualAttributes;

    const expectedAttributes = ['loginUrl', 'remoteLogoutUrl'];

    expect(virtualAttributes).toStrictEqual(expectedAttributes);
  });

  it('loginUrl should return the URL of login', () => {
    const samlAuthProvider = new SamlAuthProvider();
    samlAuthProvider.issuer = 'sample-issuer';

    vi.spyOn(appConfig, 'baseUrl', 'get').mockReturnValue(
      'https://automatisch.io'
    );

    expect(samlAuthProvider.loginUrl).toStrictEqual(
      'https://automatisch.io/login/saml/sample-issuer'
    );
  });

  it('loginCallbackUrl should return the URL of login callback', () => {
    const samlAuthProvider = new SamlAuthProvider();
    samlAuthProvider.issuer = 'sample-issuer';

    vi.spyOn(appConfig, 'baseUrl', 'get').mockReturnValue(
      'https://automatisch.io'
    );

    expect(samlAuthProvider.loginCallBackUrl).toStrictEqual(
      'https://automatisch.io/login/saml/sample-issuer/callback'
    );
  });

  it('remoteLogoutUrl should return the URL from entrypoint', () => {
    const samlAuthProvider = new SamlAuthProvider();
    samlAuthProvider.entryPoint = 'https://example.com/saml/logout';

    expect(samlAuthProvider.remoteLogoutUrl).toStrictEqual(
      'https://example.com/saml/logout'
    );
  });

  it('config should return the correct configuration object', () => {
    const samlAuthProvider = new SamlAuthProvider();

    samlAuthProvider.certificate = 'sample-certificate';
    samlAuthProvider.signatureAlgorithm = 'sha256';
    samlAuthProvider.entryPoint = 'https://example.com/saml';
    samlAuthProvider.issuer = 'sample-issuer';

    vi.spyOn(appConfig, 'baseUrl', 'get').mockReturnValue(
      'https://automatisch.io'
    );

    const expectedConfig = {
      callbackUrl: 'https://automatisch.io/login/saml/sample-issuer/callback',
      cert: 'sample-certificate',
      entryPoint: 'https://example.com/saml',
      issuer: 'sample-issuer',
      signatureAlgorithm: 'sha256',
      logoutUrl: 'https://example.com/saml',
    };

    expect(samlAuthProvider.config).toStrictEqual(expectedConfig);
  });

  it('generateLogoutRequestBody should return a correctly encoded SAML logout request', () => {
    vi.mock('uuid', () => ({
      v4: vi.fn(),
    }));

    const samlAuthProvider = new SamlAuthProvider();

    samlAuthProvider.entryPoint = 'https://example.com/saml';
    samlAuthProvider.issuer = 'sample-issuer';

    const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
    uuidv4.mockReturnValue(mockUuid);

    const sessionId = 'test-session-id';

    const logoutRequest = samlAuthProvider.generateLogoutRequestBody(sessionId);

    const expectedLogoutRequest = `
      <samlp:LogoutRequest
          xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
          ID="${mockUuid}"
          Version="2.0"
          IssueInstant="${new Date().toISOString()}"
          Destination="https://example.com/saml">

          <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">sample-issuer</saml:Issuer>
          <samlp:SessionIndex>test-session-id</samlp:SessionIndex>
      </samlp:LogoutRequest>
    `;

    const expectedEncodedRequest = Buffer.from(expectedLogoutRequest).toString(
      'base64'
    );

    expect(logoutRequest).toBe(expectedEncodedRequest);
  });

  it('terminateRemoteSession should send the correct POST request and return the response', async () => {
    vi.mock('../helpers/axios-with-proxy.js', () => ({
      default: {
        post: vi.fn(),
      },
    }));

    const samlAuthProvider = new SamlAuthProvider();

    samlAuthProvider.entryPoint = 'https://example.com/saml';
    samlAuthProvider.generateLogoutRequestBody = vi
      .fn()
      .mockReturnValue('mockEncodedLogoutRequest');

    const sessionId = 'test-session-id';

    const mockResponse = { data: 'Logout Successful' };
    axios.post.mockResolvedValue(mockResponse);

    const response = await samlAuthProvider.terminateRemoteSession(sessionId);

    expect(samlAuthProvider.generateLogoutRequestBody).toHaveBeenCalledWith(
      sessionId
    );

    expect(axios.post).toHaveBeenCalledWith(
      'https://example.com/saml',
      'SAMLRequest=mockEncodedLogoutRequest',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    expect(response).toBe(mockResponse);
  });

  describe('updateRoleMappings', () => {
    let samlAuthProvider;

    beforeEach(async () => {
      samlAuthProvider = await createSamlAuthProvider();
    });

    it('should remove all existing role mappings', async () => {
      await createRoleMapping({
        samlAuthProviderId: samlAuthProvider.id,
        remoteRoleName: 'Admin',
      });

      await createRoleMapping({
        samlAuthProviderId: samlAuthProvider.id,
        remoteRoleName: 'User',
      });

      await samlAuthProvider.updateRoleMappings([]);

      const roleMappings = await samlAuthProvider.$relatedQuery('roleMappings');
      expect(roleMappings).toStrictEqual([]);
    });

    it('should return the updated role mappings when new ones are provided', async () => {
      const adminRole = await createRole({ name: 'Admin' });
      const userRole = await createRole({ name: 'User' });

      const newRoleMappings = [
        { remoteRoleName: 'Admin', roleId: adminRole.id },
        { remoteRoleName: 'User', roleId: userRole.id },
      ];

      const result = await samlAuthProvider.updateRoleMappings(newRoleMappings);

      const refetchedRoleMappings = await samlAuthProvider.$relatedQuery(
        'roleMappings'
      );

      expect(result).toStrictEqual(refetchedRoleMappings);
    });
  });
});
