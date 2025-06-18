import Base from './base';
import Permission from './permission';
import User from './user';

class Role extends Base {
  id!: string;
  name!: string;
  key: string;
  description: string;
  users?: User[];
  permissions?: Permission[];

  static tableName = 'roles';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'key'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      key: { type: 'string', minLength: 1 },
      description: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
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
      relation: Base.ManyToManyRelation,
      modelClass: Permission,
      join: {
        from: 'roles.id',
        through: {
          from: 'roles_permissions.role_id',
          to: 'roles_permissions.permission_id',
        },
        to: 'permissions.id',
      },
    },
  });

  get isAdmin() {
    return this.key === 'admin';
  }
}

export default Role;
