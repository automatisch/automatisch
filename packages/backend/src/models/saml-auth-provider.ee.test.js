import { describe, it, expect } from 'vitest';
import SamlAuthProvider from '../models/saml-auth-provider.ee';
import SamlAuthProvidersRoleMapping from '../models/saml-auth-providers-role-mapping.ee';
import Identity from './identity.ee';
import Base from './base';

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
});
