import Base from './base';
import User from './user';

class Role extends Base {
  id!: string;
  name!: string;
  key: string;
  description: string;
  users?: User[];

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

  static relationMappings = () => ({
    users: {
      relation: Base.HasManyRelation,
      modelClass: User,
      join: {
        from: 'roles.id',
        to: 'users.role_id',
      },
    },
  });
}

export default Role;
