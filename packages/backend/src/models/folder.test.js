import { describe, it, expect } from 'vitest';
import Folder from './folder';
import User from './user';
import Base from './base';

describe('Folder model', () => {
  it('tableName should return correct name', () => {
    expect(Folder.tableName).toBe('folders');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Folder.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = Folder.relationMappings();

    const expectedRelations = {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'folders.user_id',
          to: 'users.id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});
