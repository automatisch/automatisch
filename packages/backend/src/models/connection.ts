import { QueryContext, ModelOptions } from 'objection';
import type { RelationMappings } from 'objection';
import { AES, enc } from 'crypto-js';
import Base from './base';
import User from './user';
import appConfig from '../config/app';

class Connection extends Base {
  id!: string;
  key!: string;
  data!: any;
  userId!: string;
  verified: boolean;
  count: number;

  static tableName = 'connections';

  static jsonSchema = {
    type: 'object',
    required: ['key', 'data'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      key: { type: 'string', minLength: 1, maxLength: 255 },
      data: { type: 'object' },
      userId: { type: 'string', format: 'uuid' },
      verified: { type: 'boolean' },
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
  });

  encryptData(): void {
    if (!this.eligibleForEncryption()) return;
    this.data = AES.encrypt(
      JSON.stringify(this.data),
      appConfig.encryptionKey
    ).toString();
  }

  decryptData(): void {
    if (!this.eligibleForEncryption()) return;
    this.data = JSON.parse(
      AES.decrypt(this.data, appConfig.encryptionKey).toString(enc.Utf8)
    );
  }

  eligibleForEncryption(): boolean {
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
}

export default Connection;
