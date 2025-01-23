import App from './app.js';
import OAuthClient from './oauth-client.js';
import Base from './base.js';
import { ValidationError } from 'objection';

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

  async createOAuthClient(params) {
    const supportsOauthClients = (await this.getApp())?.auth?.generateAuthUrl
      ? true
      : false;

    if (!supportsOauthClients) {
      throw new ValidationError({
        data: {
          app: [
            {
              message: 'This app does not support OAuth clients!',
            },
          ],
        },
        type: 'ModelValidation',
      });
    }

    return await this.$relatedQuery('oauthClients').insert(params);
  }
}

export default AppConfig;
