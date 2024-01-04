import Base from './base.js';
import SamlAuthProvider from './saml-auth-provider.ee.js';

class SamlAuthProvidersRoleMapping extends Base {
  static tableName = 'saml_auth_providers_role_mappings';

  static jsonSchema = {
    type: 'object',
    required: ['samlAuthProviderId', 'roleId', 'remoteRoleName'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      samlAuthProviderId: { type: 'string', format: 'uuid' },
      roleId: { type: 'string', format: 'uuid' },
      remoteRoleName: { type: 'string', minLength: 1 },
    },
  };

  static relationMappings = () => ({
    samlAuthProvider: {
      relation: Base.BelongsToOneRelation,
      modelClass: SamlAuthProvider,
      join: {
        from: 'saml_auth_providers_role_mappings.saml_auth_provider_id',
        to: 'saml_auth_providers.id',
      },
    },
  });
}

export default SamlAuthProvidersRoleMapping;
