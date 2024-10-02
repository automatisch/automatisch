import { describe, it, expect } from 'vitest';
import Identity from './identity.ee';
import User from './user';
import SamlAuthProvider from './saml-auth-provider.ee';
import Base from './base';

describe('Identity model', () => {
  it('tableName should return correct name', () => {
    expect(Identity.tableName).toBe('identities');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Identity.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = Identity.relationMappings();

    const expectedRelations = {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'identities.user_id',
        },
      },
      samlAuthProvider: {
        relation: Base.BelongsToOneRelation,
        modelClass: SamlAuthProvider,
        join: {
          from: 'saml_auth_providers.id',
          to: 'identities.provider_id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});
