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

  it('validateArrayFieldConstraints should throw error when maxItems < minItems', () => {
    const form = new Form();
    form.fields = [
      {
        type: 'array',
        name: 'Test Array',
        minItems: 5,
        maxItems: 2,
      },
    ];

    expect(() => form.validateArrayFieldConstraints()).toThrow(
      'Array field "Test Array" has maxItems (2) less than minItems (5)'
    );
  });

  it('validateArrayFieldConstraints should not throw error when maxItems >= minItems', () => {
    const form = new Form();
    form.fields = [
      {
        type: 'array',
        name: 'Test Array',
        minItems: 2,
        maxItems: 5,
      },
    ];

    expect(() => form.validateArrayFieldConstraints()).not.toThrow();
  });

  it('validateArrayFieldConstraints should not throw error when only minItems is set', () => {
    const form = new Form();
    form.fields = [
      {
        type: 'array',
        name: 'Test Array',
        minItems: 2,
      },
    ];

    expect(() => form.validateArrayFieldConstraints()).not.toThrow();
  });

  it('validateArrayFieldConstraints should not throw error when only maxItems is set', () => {
    const form = new Form();
    form.fields = [
      {
        type: 'array',
        name: 'Test Array',
        maxItems: 5,
      },
    ];

    expect(() => form.validateArrayFieldConstraints()).not.toThrow();
  });

  it('validateArrayFieldConstraints should throw error when maxItems is 0', () => {
    const form = new Form();
    form.fields = [
      {
        type: 'array',
        name: 'Test Array',
        maxItems: 0,
      },
    ];

    expect(() => form.validateArrayFieldConstraints()).toThrow(
      'Array field "Test Array" has maxItems (0) but maxItems must be at least 1'
    );
  });

  it('validateArrayFieldConstraints should throw error when maxItems is negative', () => {
    const form = new Form();
    form.fields = [
      {
        type: 'array',
        name: 'Test Array',
        maxItems: -1,
      },
    ];

    expect(() => form.validateArrayFieldConstraints()).toThrow(
      'Array field "Test Array" has maxItems (-1) but maxItems must be at least 1'
    );
  });
});
