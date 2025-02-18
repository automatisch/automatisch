import Base from './base.js';

class Template extends Base {
  static tableName = 'templates';

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      flowData: { type: 'object' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };
}

export default Template;
