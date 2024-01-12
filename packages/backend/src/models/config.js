import Base from './base.js';

class Config extends Base {
  static tableName = 'config';

  static jsonSchema = {
    type: 'object',
    required: ['key', 'value'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      key: { type: 'string', minLength: 1 },
      value: { type: 'object' },
    },
  };
}

export default Config;
