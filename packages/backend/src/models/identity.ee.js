import Base from './base.js';
import SamlAuthProvider from './saml-auth-provider.ee.js';
import User from './user.js';

class Identity extends Base {
  static tableName = 'identities';

  static jsonSchema = {
    type: 'object',
    required: ['providerId', 'remoteId', 'userId', 'providerType'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      remoteId: { type: 'string', minLength: 1 },
      providerId: { type: 'string', format: 'uuid' },
      providerType: { type: 'string', enum: ['saml'] },
    },
  };

  static relationMappings = () => ({
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
  });
}

export default Identity;
