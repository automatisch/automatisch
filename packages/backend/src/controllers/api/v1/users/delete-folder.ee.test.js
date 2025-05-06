import Crypto from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createFolder } from '../../../../../test/factories/folder.js';
import { createUser } from '../../../../../test/factories/user.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('DELETE /api/v1/users/:userId/folders/:folderId', () => {
  let token, user, folder;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
    user = await createUser();
    folder = await createFolder({ userId: user.id });
  });

  it('should remove the folder and return no content', async () => {
    await request(app)
      .delete(`/api/v1/users/${folder.userId}/folders/${folder.id}`)
      .set('x-api-token', token)
      .expect(204);
  });

  it('should return not found response for not existing user UUID', async () => {
    const notExistingUserUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/api/v1/users/${notExistingUserUUID}/folders/${folder.id}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return not found response for not existing folder UUID', async () => {
    const notExistingFolderUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/api/v1/users/${user.id}/folders/${notExistingFolderUUID}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid folder UUID', async () => {
    await request(app)
      .delete(`/api/v1/users/${user.id}/folders/invalidFolderUUID`)
      .set('x-api-token', token)
      .expect(400);
  });
});
