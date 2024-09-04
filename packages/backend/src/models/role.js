import Base from './base.js';
import Permission from './permission.js';
import User from './user.js';

class Role extends Base {
  static tableName = 'roles';

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      description: { type: ['string', 'null'], maxLength: 255 },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    users: {
      relation: Base.HasManyRelation,
      modelClass: User,
      join: {
        from: 'roles.id',
        to: 'users.role_id',
      },
    },
    permissions: {
      relation: Base.HasManyRelation,
      modelClass: Permission,
      join: {
        from: 'roles.id',
        to: 'permissions.role_id',
      },
    },
  });

  get isAdmin() {
    return this.name === 'Admin';
  }

  static async findAdmin() {
    return await this.query().findOne({ name: 'Admin' });
  }
}

export default Role;
