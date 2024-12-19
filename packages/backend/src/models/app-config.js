import App from './app.js';
import OAuthClient from './oauth-client.js';
import Base from './base.js';

class AppConfig extends Base {
  static tableName = 'app_configs';

  static get idColumn() {
    return 'key';
  }

  static jsonSchema = {
    type: 'object',
    required: ['key'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      key: { type: 'string' },
      useOnlyPredefinedAuthClients: { type: 'boolean', default: false },
      disabled: { type: 'boolean', default: false },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    oauthClients: {
      relation: Base.HasManyRelation,
      modelClass: OAuthClient,
      join: {
        from: 'app_configs.key',
        to: 'oauth_clients.app_key',
      },
    },
  });

  async getApp() {
    if (!this.key) return null;

    return await App.findOneByKey(this.key);
  }
}

export default AppConfig;
