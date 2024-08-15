import Base from './base.js';
import Permission from './permission.js';
import User from './user.js';

class Role extends Base {
  static tableName = 'roles';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'key'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      key: { type: 'string', minLength: 1 },
      description: { type: ['string', 'null'], maxLength: 255 },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static get virtualAttributes() {
    return ['isAdmin'];
  }

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
    return this.key === 'admin';
  }

  static async findAdmin() {
    return await this.query().findOne({ key: 'admin' });
  }
}

export default Role;
