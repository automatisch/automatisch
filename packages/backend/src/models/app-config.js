import App from './app.js';
import AppAuthClient from './app-auth-client.js';
import Base from './base.js';

class AppConfig extends Base {
  static tableName = 'app_configs';

  static jsonSchema = {
    type: 'object',
    required: ['key'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      key: { type: 'string' },
      allowCustomConnection: { type: 'boolean', default: false },
      shared: { type: 'boolean', default: false },
      disabled: { type: 'boolean', default: false },
    },
  };

  static relationMappings = () => ({
    appAuthClients: {
      relation: Base.HasManyRelation,
      modelClass: AppAuthClient,
      join: {
        from: 'app_configs.key',
        to: 'app_auth_clients.app_key',
      },
    },
  });

  static get virtualAttributes() {
    return ['canConnect', 'canCustomConnect'];
  }

  get canCustomConnect() {
    return !this.disabled && this.allowCustomConnection;
  }

  get canConnect() {
    const hasSomeActiveAppAuthClients = !!this.appAuthClients?.some(
      (appAuthClient) => appAuthClient.active
    );
    const shared = this.shared;
    const active = this.disabled === false;

    const conditions = [hasSomeActiveAppAuthClients, shared, active];

    return conditions.every(Boolean);
  }

  async getApp() {
    if (!this.key) return null;

    return await App.findOneByKey(this.key);
  }
}

export default AppConfig;
