import { describe, it, expect, beforeEach } from 'vitest';
import { createFolder } from '@/factories/folder.js';
import folderSerializer from '@/serializers/folder.js';

describe('folder serializer', () => {
  let folder;

  beforeEach(async () => {
    folder = await createFolder();
  });

  it('should return folder data', async () => {
    const expectedPayload = {
      id: folder.id,
      name: folder.name,
      createdAt: folder.createdAt.getTime(),
      updatedAt: folder.updatedAt.getTime(),
    };

    expect(folderSerializer(folder)).toStrictEqual(expectedPayload);
  });
});
