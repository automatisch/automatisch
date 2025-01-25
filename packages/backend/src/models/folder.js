import Base from './base.js';
import User from './user.js';

class Folder extends Base {
  static tableName = 'folders';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      userId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'folders.user_id',
        to: 'users.id',
      },
    },
  });
}

export default Folder;
