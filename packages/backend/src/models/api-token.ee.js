import Base from './base.js';
import crypto from 'crypto';
class ApiToken extends Base {
  static tableName = 'api_tokens';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      token: { type: 'string', minLength: 32 },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  async assignToken() {
    this.token = crypto.randomBytes(48).toString('hex');
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    await this.assignToken();
  }
}

export default ApiToken;
