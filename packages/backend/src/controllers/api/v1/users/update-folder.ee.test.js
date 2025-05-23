import { vi, describe, it, expect, beforeEach } from 'vitest';
import Crypto from 'node:crypto';
import request from 'supertest';
import app from '../../../../app.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createFolder } from '../../../../../test/factories/folder.js';
import updateFolderMock from '../../../../../test/mocks/rest/api/v1/users/update-folder.js';
import * as license from '../../../../helpers/license.ee.js';

describe('PATCH /api/v1/users/:userId/folders', () => {
  let currentUser, token, folder;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();

    folder = await createFolder({
      userId: currentUser.id,
      name: 'Test Folder',
    });

    token = (await createApiToken()).token;
  });

  it('should return updated folder for the given user', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${currentUser.id}/folders/${folder.id}`)
      .set('x-api-token', token)
      .send({
        name: 'Updated Folder',
      })
      .expect(200);

    const refetchedFolder = await currentUser
      .$relatedQuery('folders')
      .findById(folder.id);

    const expectedPayload = await updateFolderMock(refetchedFolder);

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return unprocessable entity response for invalid data', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/${currentUser.id}/folders/${folder.id}`)
      .set('x-api-token', token)
      .send({ name: '' })
      .expect(422);

    expect(response.body.errors.name).toStrictEqual([
      'must NOT have fewer than 1 characters',
    ]);
  });

  it('should respond with HTTP 404 for non-existent user', async () => {
    const notExistingUserId = Crypto.randomUUID();

    await request(app)
      .patch(`/api/v1/users/${notExistingUserId}/folders/${folder.id}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should respond with HTTP 404 for non-existent folder', async () => {
    const notExistingFolderId = Crypto.randomUUID();

    await request(app)
      .patch(`/api/v1/users/${currentUser.id}/folders/${notExistingFolderId}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid user UUID', async () => {
    await request(app)
      .patch(`/api/v1/users/invalidUserUUID/folders/${folder.id}`)
      .set('x-api-token', token)
      .expect(400);
  });

  it('should return bad request response for invalid folder UUID', async () => {
    await request(app)
      .patch(`/api/v1/users/${currentUser.id}/folders/invalidFolderUUID`)
      .set('x-api-token', token)
      .expect(400);
  });
});
