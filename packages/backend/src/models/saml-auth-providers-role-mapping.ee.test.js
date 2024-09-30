import { describe, it, expect } from 'vitest';
import SamlAuthProvidersRoleMapping from '../models/saml-auth-providers-role-mapping.ee';
import SamlAuthProvider from './saml-auth-provider.ee';
import Base from './base';

describe('SamlAuthProvidersRoleMapping model', () => {
  it('tableName should return correct name', () => {
    expect(SamlAuthProvidersRoleMapping.tableName).toBe(
      'saml_auth_providers_role_mappings'
    );
  });

  it('jsonSchema should have the correct schema', () => {
    expect(SamlAuthProvidersRoleMapping.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = SamlAuthProvidersRoleMapping.relationMappings();

    const expectedRelations = {
      samlAuthProvider: {
        relation: Base.BelongsToOneRelation,
        modelClass: SamlAuthProvider,
        join: {
          from: 'saml_auth_providers_role_mappings.saml_auth_provider_id',
          to: 'saml_auth_providers.id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});
