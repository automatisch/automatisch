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
      customConnectionAllowed: { type: 'boolean', default: false },
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

  async updateConnectionAllowedProperty() {
    const connectionAllowed = await this.computeConnectionAllowedProperty();

    return await this.$query().patch({
      connectionAllowed,
    });
  }

  async computeAndAssignConnectionAllowedProperty() {
    this.connectionAllowed = await this.computeConnectionAllowedProperty();
  }

  async computeConnectionAllowedProperty() {
    const appAuthClients = await this.$relatedQuery('appAuthClients');

    const hasSomeActiveAppAuthClients =
      appAuthClients?.some((appAuthClient) => appAuthClient.active) || false;

    const conditions = [
      hasSomeActiveAppAuthClients,
      this.shared,
      !this.disabled,
    ];

    const connectionAllowed = conditions.every(Boolean);

    return connectionAllowed;
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    await this.computeAndAssignConnectionAllowedProperty();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);

    await this.computeAndAssignConnectionAllowedProperty();
  }
}

export default AppConfig;
