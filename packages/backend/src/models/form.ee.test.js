import { describe, it, expect } from 'vitest';
import User from '@/models/user';
import Base from '@/models/base';
import Form from '@/models/form.ee';

describe('Form model', () => {
  it('tableName should return correct name', () => {
    expect(Form.tableName).toBe('forms');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Form.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = Form.relationMappings();

    const expectedRelations = {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'forms.user_id',
          to: 'users.id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});
