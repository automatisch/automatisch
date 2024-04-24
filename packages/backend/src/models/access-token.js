import Base from './base.js';
import User from './user.js';

class AccessToken extends Base {
  static tableName = 'access_tokens';

  static jsonSchema = {
    type: 'object',
    required: ['token', 'expiresIn'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      token: { type: 'string', minLength: 32 },
      expiresIn: { type: 'integer' },
      revokedAt: { type: ['string', 'null'], format: 'date-time' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'access_tokens.user_id',
        to: 'users.id',
      },
    },
  });
}

export default AccessToken;
