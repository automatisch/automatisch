import Base from './base.js';
import User from './user.js';

class Form extends Base {
  static tableName = 'forms';

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      fields: { type: 'array' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'forms.user_id',
        to: 'users.id',
      },
    },
  });
}

export default Form;
