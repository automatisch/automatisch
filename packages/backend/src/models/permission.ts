import Base from './base';

class Permission extends Base {
  id: string;
  roleId: string;
  action: string;
  subject: string;
  conditions: string[];

  static tableName = 'permissions';

  static jsonSchema = {
    type: 'object',
    required: ['roleId', 'action', 'subject'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      roleId: { type: 'string', format: 'uuid' },
      action: { type: 'string', minLength: 1 },
      subject: { type: 'string', minLength: 1 },
      conditions: { type: 'array', items: { type: 'string' } },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };
}

export default Permission;
