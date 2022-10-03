import { QueryContext, ModelOptions } from 'objection';
import type { RelationMappings } from 'objection';
import { AES, enc } from 'crypto-js';
import Base from './base';
import User from './user';
import Step from './step';
import App from './app';
import appConfig from '../config/app';
import { IJSONObject } from '@automatisch/types';
import Telemetry from '../helpers/telemetry';

class Connection extends Base {
  id!: string;
  key!: string;
  data: string;
  formattedData?: IJSONObject;
  userId!: string;
  verified = false;
  draft: boolean;
  count?: number;
  flowCount?: number;

  static tableName = 'connections';

  static jsonSchema = {
    type: 'object',
    required: ['key'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      key: { type: 'string', minLength: 1, maxLength: 255 },
      data: { type: 'string' },
      formattedData: { type: 'object' },
      userId: { type: 'string', format: 'uuid' },
      verified: { type: 'boolean' },
      draft: { type: 'boolean' },
    },
  };

  static relationMappings = (): RelationMappings => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'connections.user_id',
        to: 'users.id',
      },
    },
    steps: {
      relation: Base.HasManyRelation,
      modelClass: Step,
      join: {
        from: 'connections.id',
        to: 'steps.connection_id',
      },
    },
  });

  get appData() {
    return App.findOneByKey(this.key);
  }

  encryptData(): void {
    if (!this.eligibleForEncryption()) return;

    this.data = AES.encrypt(
      JSON.stringify(this.formattedData),
      appConfig.encryptionKey
    ).toString();

    delete this.formattedData;
  }

  decryptData(): void {
    if (!this.eligibleForDecryption()) return;

    this.formattedData = JSON.parse(
      AES.decrypt(this.data, appConfig.encryptionKey).toString(enc.Utf8)
    );
  }

  eligibleForEncryption(): boolean {
    return this.formattedData ? true : false;
  }

  eligibleForDecryption(): boolean {
    return this.data ? true : false;
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

  async $afterInsert(queryContext: QueryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.connectionCreated(this);
  }

  async $afterUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$afterUpdate(opt, queryContext);
    Telemetry.connectionUpdated(this);
  }
}

export default Connection;
