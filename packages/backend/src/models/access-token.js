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
      samlSessionId: { type: ['string', 'null'] },
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

  async terminateRemoteSamlSession() {
    if (!this.samlSessionId) {
      return;
    }

    const user = await this
      .$relatedQuery('user');

    const firstIdentity = await user
      .$relatedQuery('identities')
      .first();

    const samlAuthProvider = await firstIdentity
      .$relatedQuery('samlAuthProvider')
      .throwIfNotFound();

    const response = await samlAuthProvider.terminateRemoteSession(this.samlSessionId);

    return response;
  }

  async revoke() {
    const response = await this.$query().patch({ revokedAt: new Date().toISOString() });

    try {
      await this.terminateRemoteSamlSession();
    } catch (error) {
      // TODO: should it silently fail or not?
    }

    return response;
  }
}

export default AccessToken;
