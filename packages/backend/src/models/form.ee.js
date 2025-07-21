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
              enum: [
                'array',
                'checkbox',
                'date',
                'datetime',
                'dropdown',
                'multiline',
                'string',
                'time',
              ],
            },
            options: { type: 'array' },
            required: { type: 'boolean' },
            readonly: { type: 'boolean' },
            validationFormat: {
              type: ['string', 'null'],
              enum: [
                null,
                '',
                'alphanumeric',
                'custom',
                'email',
                'number',
                'tel',
                'url',
              ],
            },
            validationPattern: { type: 'string' },
            validationHelperText: { type: 'string' },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 1 },
                  key: { type: 'string', minLength: 1 },
                  type: {
                    type: 'string',
                    enum: [
                      'checkbox',
                      'date',
                      'datetime',
                      'dropdown',
                      'multiline',
                      'string',
                      'time',
                    ],
                  },
                  options: { type: 'array' },
                  required: { type: 'boolean' },
                  readonly: { type: 'boolean' },
                  validationFormat: {
                    type: ['string', 'null'],
                    enum: [
                      null,
                      '',
                      'alphanumeric',
                      'custom',
                      'email',
                      'number',
                      'tel',
                      'url',
                    ],
                  },
                  validationPattern: { type: 'string' },
                  validationHelperText: { type: 'string' },
                },
                required: ['key', 'name', 'type'],
              },
            },
            minItems: { type: 'integer', minimum: 0 },
            maxItems: { type: 'integer', minimum: 1 },
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

  validateArrayFieldConstraints() {
    if (!this.fields || !Array.isArray(this.fields)) return;

    for (const field of this.fields) {
      if (field.type === 'array') {
        if (field.maxItems != null && field.maxItems < 1) {
          throw new Error(
            `Array field "${field.name}" has maxItems (${field.maxItems}) but maxItems must be at least 1`
          );
        }

        if (
          field.minItems != null &&
          field.maxItems != null &&
          field.maxItems < field.minItems
        ) {
          throw new Error(
            `Array field "${field.name}" has maxItems (${field.maxItems}) less than minItems (${field.minItems})`
          );
        }
      }
    }
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.validateArrayFieldConstraints();
  }

  async $beforeUpdate(opts, queryContext) {
    await super.$beforeUpdate(opts, queryContext);
    this.validateArrayFieldConstraints();
  }
}

export default Form;
