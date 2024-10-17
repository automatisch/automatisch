import AES from 'crypto-js/aes.js';
import enc from 'crypto-js/enc-utf8.js';
import appConfig from '../config/app.js';
import Base from './base.js';
import AppConfig from './app-config.js';

class AppAuthClient extends Base {
  static tableName = 'app_auth_clients';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'appKey', 'formattedAuthDefaults'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      appKey: { type: 'string' },
      active: { type: 'boolean' },
      authDefaults: { type: ['string', 'null'] },
      formattedAuthDefaults: { type: 'object' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    appConfig: {
      relation: Base.HasOneRelation,
      modelClass: AppConfig,
      join: {
        from: 'app_auth_clients.app_key',
        to: 'app_configs.key',
      },
    },
  });

  encryptData() {
    if (!this.eligibleForEncryption()) return;

    this.authDefaults = AES.encrypt(
      JSON.stringify(this.formattedAuthDefaults),
      appConfig.encryptionKey
    ).toString();

    delete this.formattedAuthDefaults;
  }

  decryptData() {
    if (!this.eligibleForDecryption()) return;

    this.formattedAuthDefaults = JSON.parse(
      AES.decrypt(this.authDefaults, appConfig.encryptionKey).toString(enc)
    );
  }

  eligibleForEncryption() {
    return this.formattedAuthDefaults ? true : false;
  }

  eligibleForDecryption() {
    return this.authDefaults ? true : false;
  }

  async triggerAppConfigUpdate() {
    const appConfig = await this.$relatedQuery('appConfig');

    // This is a workaround to update connection allowed column for AppConfig
    await appConfig?.$query().patch({
      key: appConfig.key,
    });
  }

  // TODO: Make another abstraction like beforeSave instead of using
  // beforeInsert and beforeUpdate separately for the same operation.
  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.encryptData();
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);

    await this.triggerAppConfigUpdate();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.encryptData();
  }

  async $afterUpdate(opt, queryContext) {
    await super.$afterUpdate(opt, queryContext);

    await this.triggerAppConfigUpdate();
  }

  async $afterFind() {
    this.decryptData();
  }
}

export default AppAuthClient;
