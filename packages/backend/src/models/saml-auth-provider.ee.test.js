import { vi, describe, it, expect } from 'vitest';
import SamlAuthProvider from '../models/saml-auth-provider.ee';
import SamlAuthProvidersRoleMapping from '../models/saml-auth-providers-role-mapping.ee';
import Identity from './identity.ee';
import Base from './base';
import appConfig from '../config/app';

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
      samlAuthProvidersRoleMappings: {
        relation: Base.HasManyRelation,
        modelClass: SamlAuthProvidersRoleMapping,
        join: {
          from: 'saml_auth_providers.id',
          to: 'saml_auth_providers_role_mappings.saml_auth_provider_id',
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
});
