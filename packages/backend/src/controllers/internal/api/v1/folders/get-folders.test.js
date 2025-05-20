import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFolder } from '../../../../../../test/factories/folder.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import getFoldersMock from '../../../../../../test/mocks/rest/internal/api/v1/folders/get-folders.js';

describe('GET /internal/api/v1/folders', () => {
  let folderOne, folderTwo, currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    folderOne = await createFolder({
      name: 'Folder One',
      userId: currentUser.id,
    });

    folderTwo = await createFolder({
      name: 'Folder Two',
      userId: currentUser.id,
    });

    const anotherUser = await createUser();

    await createFolder({
      name: 'Folder Three',
      userId: anotherUser.id,
    });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return folders of the current user', async () => {
    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
    });

    const response = await request(app)
      .get('/internal/api/v1/folders')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFoldersMock([folderOne, folderTwo]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
