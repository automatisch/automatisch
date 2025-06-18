import Base from './base';

class Permission extends Base {
  id: string;
  action: string;
  subject: string;
  conditions: string[];

  static tableName = 'permissions';

  static jsonSchema = {
    type: 'object',
    required: ['action', 'subject'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      action: { type: 'string', minLength: 1 },
      subject: { type: 'string', minLength: 1 },
      conditions: { type: 'array', items: { type: 'string' } },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };
}

export default Permission;
