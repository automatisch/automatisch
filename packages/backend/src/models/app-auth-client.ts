import { IJSONObject } from '@automatisch/types';
import { AES, enc } from 'crypto-js';
import { ModelOptions, QueryContext } from 'objection';
import appConfig from '../config/app';
import AppConfig from './app-config';
import Base from './base';

class AppAuthClient extends Base {
  id!: string;
  name: string;
  active: boolean;
  appConfigId!: string;
  authDefaults: string;
  formattedAuthDefaults?: IJSONObject;
  appConfig?: AppConfig;

  static tableName = 'app_auth_clients';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'appConfigId', 'formattedAuthDefaults'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      appConfigId: { type: 'string', format: 'uuid' },
      active: { type: 'boolean' },
      authDefaults: { type: ['string', 'null'] },
      formattedAuthDefaults: { type: 'object' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    appConfig: {
      relation: Base.BelongsToOneRelation,
      modelClass: AppConfig,
      join: {
        from: 'app_auth_clients.app_config_id',
        to: 'app_configs.id',
      },
    },
  });

  encryptData(): void {
    if (!this.eligibleForEncryption()) return;

    this.authDefaults = AES.encrypt(
      JSON.stringify(this.formattedAuthDefaults),
      appConfig.encryptionKey
    ).toString();

    delete this.formattedAuthDefaults;
  }
  decryptData(): void {
    if (!this.eligibleForDecryption()) return;

    this.formattedAuthDefaults = JSON.parse(
      AES.decrypt(this.authDefaults, appConfig.encryptionKey).toString(enc.Utf8)
    );
  }

  eligibleForEncryption(): boolean {
    return this.formattedAuthDefaults ? true : false;
  }

  eligibleForDecryption(): boolean {
    return this.authDefaults ? true : false;
  }

  // TODO: Make another abstraction like beforeSave instead of using
  // beforeInsert and beforeUpdate separately for the same operation.
  async $beforeInsert(queryContext: QueryContext): Promise<void> {
    await super.$beforeInsert(queryContext);
    this.encryptData();
  }

  async $beforeUpdate(
    opt: ModelOptions,
    queryContext: QueryContext
  ): Promise<void> {
    await super.$beforeUpdate(opt, queryContext);
    this.encryptData();
  }

  async $afterFind(): Promise<void> {
    this.decryptData();
  }
}

export default AppAuthClient;
