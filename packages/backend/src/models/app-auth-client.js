import AES from 'crypto-js/aes.js';
import enc from 'crypto-js/enc-utf8.js';
import appConfig from '../config/app.js';
import Base from './base.js';

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

  // TODO: Make another abstraction like beforeSave instead of using
  // beforeInsert and beforeUpdate separately for the same operation.
  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.encryptData();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.encryptData();
  }

  async $afterFind() {
    this.decryptData();
  }
}

export default AppAuthClient;
