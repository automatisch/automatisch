import { IJSONValue } from '@automatisch/types';
import Base from './base';

class Config extends Base {
  id!: string;
  key!: string;
  value!: { data: IJSONValue };

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
