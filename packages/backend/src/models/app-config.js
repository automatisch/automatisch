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
      canConnect: { type: 'boolean', default: false },
      allowCustomConnection: { type: 'boolean', default: false },
      shared: { type: 'boolean', default: false },
      disabled: { type: 'boolean', default: false },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
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
    return ['canCustomConnect'];
  }

  get canCustomConnect() {
    return !this.disabled && this.allowCustomConnection;
  }

  async getApp() {
    if (!this.key) return null;

    return await App.findOneByKey(this.key);
  }

  async updateCanConnectValue() {
    const appAuthClients = await this.$relatedQuery('appAuthClients');
    const hasSomeActiveAppAuthClients = !!appAuthClients?.some(
      (appAuthClient) => appAuthClient.active
    );
    const shared = this.shared;
    const active = this.disabled === false;

    const conditions = [hasSomeActiveAppAuthClients, shared, active];

    this.canConnect = conditions.every(Boolean);

    return this;
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);

    await opt.old.updateCanConnectValue();
  }
}

export default AppConfig;
