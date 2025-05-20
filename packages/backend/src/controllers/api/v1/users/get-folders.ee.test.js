import Crypto from 'node:crypto';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createFolder } from '../../../../../test/factories/folder.js';
import getFoldersMock from '../../../../../test/mocks/rest/api/v1/users/get-folders.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/users/:userId/folders', () => {
  let folderA, folderB, currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();

    folderA = await createFolder({
      name: 'Folder A',
      userId: currentUser.id,
    });

    folderB = await createFolder({
      name: 'Folder B',
      userId: currentUser.id,
    });

    await createFolder({
      name: 'Folder C',
    });

    token = (await createApiToken()).token;
  });

  it('should return folders of the given user', async () => {
    const response = await request(app)
      .get(`/api/v1/users/${currentUser.id}/folders`)
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getFoldersMock([folderA, folderB]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should respond with HTTP 404 for non-existent user', async () => {
    const notExistingUserId = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/users/${notExistingUserId}/folders`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid user UUID', async () => {
    await request(app)
      .get(`/api/v1/users/invalidUserUUID/folders`)
      .set('x-api-token', token)
      .expect(400);
  });

  it('should respond with HTTP 404 for no folders of the given user', async () => {
    const user = await createUser();

    const response = await request(app)
      .get(`/api/v1/users/${user.id}/folders`)
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getFoldersMock([]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
