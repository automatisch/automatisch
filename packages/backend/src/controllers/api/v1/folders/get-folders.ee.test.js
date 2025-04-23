import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createFolder } from '../../../../../test/factories/folder.js';
import getFoldersMock from '../../../../../test/mocks/rest/api/v1/folders/get-folders.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/folders', () => {
  let folderA, folderB, folderC, currentUser, anotherUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();
    anotherUser = await createUser();

    folderC = await createFolder({
      name: 'Folder C',
      userId: currentUser.id,
    });

    folderA = await createFolder({
      name: 'Folder A',
      userId: anotherUser.id,
    });

    folderB = await createFolder({
      name: 'Folder B',
      userId: anotherUser.id,
    });

    token = (await createApiToken()).token;
  });

  it('should return all folders', async () => {
    const response = await request(app)
      .get('/api/v1/folders')
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getFoldersMock([folderA, folderB, folderC]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
