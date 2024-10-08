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

  async computeCanConnectProperty(oldAppConfig) {
    const appAuthClients = await oldAppConfig.$relatedQuery('appAuthClients');
    const hasSomeActiveAppAuthClients = !!appAuthClients?.some(
      (appAuthClient) => appAuthClient.active
    );
    const shared = this.shared ?? oldAppConfig.shared;
    const disabled = this.disabled ?? oldAppConfig.disabled;
    const active = disabled === false;

    const conditions = [hasSomeActiveAppAuthClients, shared, active];

    const canConnect = conditions.every(Boolean);

    return canConnect;
  }

  async updateCanConnectProperty() {
    const canConnect = await this.computeCanConnectProperty(this);

    return await this.$query().patch({
      canConnect,
    });
  }

  async computeAndAssignCanConnectProperty(oldAppConfig) {
    this.canConnect = await this.computeCanConnectProperty(oldAppConfig);
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    await this.computeAndAssignCanConnectProperty(this);
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);

    const oldAppConfig = opt.old;

    await this.computeAndAssignCanConnectProperty(oldAppConfig);
  }
}

export default AppConfig;
