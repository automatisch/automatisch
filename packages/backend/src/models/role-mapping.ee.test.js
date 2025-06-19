import { describe, it, expect } from 'vitest';
import RoleMapping from '@/models/role-mapping.ee.js';
import SamlAuthProvider from '@/models/saml-auth-provider.ee.js';
import Base from '@/models/base.js';

describe('RoleMapping model', () => {
  it('tableName should return correct name', () => {
    expect(RoleMapping.tableName).toBe('role_mappings');
  });

  it('jsonSchema should have the correct schema', () => {
    expect(RoleMapping.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = RoleMapping.relationMappings();

    const expectedRelations = {
      samlAuthProvider: {
        relation: Base.BelongsToOneRelation,
        modelClass: SamlAuthProvider,
        join: {
          from: 'role_mappings.saml_auth_provider_id',
          to: 'saml_auth_providers.id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});
