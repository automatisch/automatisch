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
      connectionAllowed: { type: 'boolean', default: false },
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

  async getApp() {
    if (!this.key) return null;

    return await App.findOneByKey(this.key);
  }

  async computeConnectionAllowedProperty(oldAppConfig) {
    const appAuthClients = await oldAppConfig.$relatedQuery('appAuthClients');
    const hasSomeActiveAppAuthClients = !!appAuthClients?.some(
      (appAuthClient) => appAuthClient.active
    );
    const shared = this.shared ?? oldAppConfig.shared;
    const disabled = this.disabled ?? oldAppConfig.disabled;
    const active = disabled === false;

    const conditions = [hasSomeActiveAppAuthClients, shared, active];

    const connectionAllowed = conditions.every(Boolean);

    return connectionAllowed;
  }

  async updateConnectionAllowedProperty() {
    const connectionAllowed = await this.computeConnectionAllowedProperty(this);

    return await this.$query().patch({
      connectionAllowed,
    });
  }

  async computeAndAssignConnectionAllowedProperty(oldAppConfig) {
    this.connectionAllowed = await this.computeConnectionAllowedProperty(
      oldAppConfig
    );
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    await this.computeAndAssignConnectionAllowedProperty(this);
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);

    const oldAppConfig = opt.old;

    await this.computeAndAssignConnectionAllowedProperty(oldAppConfig);
  }
}

export default AppConfig;
