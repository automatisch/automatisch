import { describe, it, expect } from 'vitest';
import Folder from './folder';
import User from './user';
import Flow from './flow';
import Base from './base';
import { createFolder } from '../../test/factories/folder';
import { createFlow } from '../../test/factories/flow';
import { createUser } from '../../test/factories/user';

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
      flows: {
        relation: Base.HasManyRelation,
        modelClass: Flow,
        join: {
          from: 'folders.id',
          to: 'flows.folder_id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  describe('delete', () => {
    it('should set folderId to null for all related flows before deleting the folder', async () => {
      const user = await createUser();

      const folder = await createFolder({ userId: user.id });
      const flow = await createFlow({ folderId: folder.id, userId: user.id });

      await folder.delete();

      const refetchedFlow = await flow.$query();
      expect(refetchedFlow.folderId).toBe(null);
    });

    it('should set folderId to null for all related soft-deleted flows before deleting the folder', async () => {
      const user = await createUser();

      const folder = await createFolder({ userId: user.id });
      const flow = await createFlow({ folderId: folder.id, userId: user.id });

      await flow.$query().delete();

      await folder.delete();

      const refetchedFlow = await flow.$query().withSoftDeleted();
      expect(refetchedFlow.folderId).toBe(null);
    });

    it('should delete the folder', async () => {
      const user = await createUser();
      const folder = await createFolder({ userId: user.id });

      await folder.delete();

      const deletedFolder = await Folder.query().findById(folder.id);
      expect(deletedFolder).toBeUndefined();
    });
  });
});
