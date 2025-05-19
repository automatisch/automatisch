import Base from './base.js';
import User from './user.js';
import Flow from './flow.js';

class Folder extends Base {
  static tableName = 'folders';

  static jsonSchema = {
    type: 'object',
    required: ['name'],

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
    flows: {
      relation: Base.HasManyRelation,
      modelClass: Flow,
      join: {
        from: 'folders.id',
        to: 'flows.folder_id',
      },
    },
  });

  async delete() {
    await this.$relatedQuery('flows')
      .withSoftDeleted()
      .patch({ folderId: null });

    await this.$query().delete();
  }
}

export default Folder;
