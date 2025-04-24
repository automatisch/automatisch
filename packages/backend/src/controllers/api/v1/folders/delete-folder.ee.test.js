import Crypto from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createFolder } from '../../../../../test/factories/folder.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('DELETE /api/v1/folders/:folderId', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
  });

  it('should remove the folder and return no content', async () => {
    const folder = await createFolder();

    await request(app)
      .delete(`/api/v1/folders/${folder.id}`)
      .set('x-api-token', token)
      .expect(204);
  });

  it('should return not found response for not existing folder UUID', async () => {
    const notExistingFolderUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/api/v1/folders/${notExistingFolderUUID}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .delete('/api/v1/folders/invalidFolderUUID')
      .set('x-api-token', token)
      .expect(400);
  });
});
