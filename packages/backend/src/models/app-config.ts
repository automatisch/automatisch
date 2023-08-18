import App from './app';
import Base from './base';
import AppAuthClient from './app-auth-client';

class AppConfig extends Base {
  id!: string;
  key!: string;
  allowCustomConnection: boolean;
  shared: boolean;
  disabled: boolean;
  app?: App;
  appAuthClients?: AppAuthClient[];

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

  static get virtualAttributes() {
    return ['canConnect', 'canCustomConnect'];
  }

  static relationMappings = () => ({
    appAuthClients: {
      relation: Base.HasManyRelation,
      modelClass: AppAuthClient,
      join: {
        from: 'app_configs.id',
        to: 'app_auth_clients.app_config_id',
      },
    },
  });

  get canCustomConnect() {
    return !this.disabled && this.allowCustomConnection;
  }

  get canConnect() {
    const hasSomeActiveAppAuthClients = !!this.appAuthClients
      ?.some(appAuthClient => appAuthClient.active);
    const shared = this.shared;
    const active = this.disabled === false;

    const conditions = [
      hasSomeActiveAppAuthClients,
      shared,
      active
    ];

    return conditions.every(Boolean);
  }

  async getApp() {
    if (!this.key) return null;

    return await App.findOneByKey(this.key);
  }
}

export default AppConfig;
