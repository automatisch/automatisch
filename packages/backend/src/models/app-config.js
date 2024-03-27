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
      canConnect: { type: 'boolean', default: false },
    },
  };

  async getApp() {
    if (!this.key) return null;

    return await App.findOneByKey(this.key);
  }

  async hasActiveAppAuthClients() {
    const appAuthClients = await AppAuthClient.query().where({
      appKey: this.key,
    });

    const hasSomeActiveAppAuthClients = !!appAuthClients?.some(
      (appAuthClient) => appAuthClient.active
    );

    return hasSomeActiveAppAuthClients;
  }

  async assignCanConnect() {
    const shared = this.shared;
    const active = this.disabled === false;
    const hasSomeActiveAppAuthClients = await this.hasActiveAppAuthClients();

    const conditions = [hasSomeActiveAppAuthClients, shared, active];
    const canConnect = conditions.every(Boolean);

    this.canConnect = canConnect;
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    await this.assignCanConnect();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    await this.assignCanConnect();
  }
}

export default AppConfig;
