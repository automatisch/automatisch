import Base from './base';
import Role from './role';
import User from './user';

class SharedConnection extends Base {
  id!: string;
  roleId!: string;
  connectionId!: string;

  static tableName = 'shared_connections';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'key'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      roleId: { type: 'string', format: 'uuid' },
      connectionId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    roles: {
      relation: Base.HasManyRelation,
      modelClass: Role,
      join: {
        from: 'shared_connections.role_id',
        to: 'roles.id',
      },
    },
    users: {
      relation: Base.HasManyRelation,
      modelClass: User,
      join: {
        from: 'shared_connections.role_id',
        to: 'users.role_id',
      },
    },
  });
}

export default SharedConnection;
