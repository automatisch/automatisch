import Base from './base.js';

class ApiToken extends Base {
  static tableName = 'api_tokens';

  static jsonSchema = {
    type: 'object',
    required: ['token'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      token: { type: 'string', minLength: 32 },
    },
  };
}

export default ApiToken;
