import { QueryContext, ModelOptions } from 'objection';
import { AES, enc } from 'crypto-js';
import Base from './base'
import User from './user'
import appConfig from '../config/app';

class Connection extends Base {
  id!: number
  key!: string
  data!: any
  userId!: number
  verified: boolean
  count: number

  static tableName = 'connections';

  static jsonSchema = {
    type: 'object',
    required: ['key', 'data', 'userId'],

    properties: {
      id: { type: 'integer' },
      key: { type: 'string', minLength: 1, maxLength: 255 },
      data: { type: 'object' },
      userId: { type: 'integer' },
      verified: { type: 'boolean' },
    }
  }

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'connections.user_id',
        to: 'users.id',
      },
    }
  })

  encryptData() {
    this.data = AES.encrypt(JSON.stringify(this.data), appConfig.encryptionKey).toString();
  }

  async decryptData() {
    this.data = JSON.parse(AES.decrypt(this.data, appConfig.encryptionKey).toString(enc.Utf8));
  }

  // TODO: Make another abstraction like beforeSave instead of using
  // beforeInsert and beforeUpdate separately for the same operation.
  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    await this.encryptData();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);
    await this.encryptData();
  }

  async $afterFind(queryContext: QueryContext) {
    await this.decryptData();
  }
}

export default Connection;
