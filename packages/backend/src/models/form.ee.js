import Base from '@/models/base.js';
import User from '@/models/user.js';

class Form extends Base {
  static tableName = 'forms';

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      displayName: { type: 'string' },
      fields: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            key: { type: 'string', minLength: 1 },
            type: {
              type: 'string',
              enum: ['string', 'checkbox', 'dropdown', 'multiline', 'date', 'time', 'datetime'],
            },
            options: { type: 'array' },
            required: { type: 'boolean' },
            readonly: { type: 'boolean' },
            validationFormat: {
              type: ['string', 'null'],
              enum: ['email', 'url', 'tel', 'number', 'alphanumeric', 'custom', null, ''],
            },
            validationPattern: { type: 'string' },
            validationHelperText: { type: 'string' },
          },
          required: ['key', 'name', 'type'],
        },
      },
      description: { type: 'string' },
      responseMessage: { type: 'string' },
      submitButtonText: { type: 'string' },
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
