import Base from './base';

class Permission extends Base {
  id: string;
  action: string;
  subject: string;

  static tableName = 'permissions';

  static jsonSchema = {
    type: 'object',
    required: ['action', 'subject'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      action: { type: 'string', minLength: 1 },
      subject: { type: 'string', minLength: 1 },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };
}

export default Permission;
