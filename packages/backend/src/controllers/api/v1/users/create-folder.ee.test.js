import Crypto from 'node:crypto';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createUser } from '../../../../../test/factories/user.js';
import createFolderMock from '../../../../../test/mocks/rest/api/v1/users/create-folder.js';
import * as license from '../../../../helpers/license.ee.js';

describe('POST /api/v1/users/:userId/folders', () => {
  let currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);
    currentUser = await createUser();

    token = (await createApiToken()).token;
  });

  it('should return created folder for the given user', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${currentUser.id}/folders`)
      .set('x-api-token', token)
      .send({
        name: 'Test Folder',
      })
      .expect(201);

    const refetchedFolder = await currentUser
      .$relatedQuery('folders')
      .findById(response.body.data.id);

    const expectedPayload = await createFolderMock(refetchedFolder);

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return unprocessable entity response for invalid data', async () => {
    const response = await request(app)
      .post(`/api/v1/users/${currentUser.id}/folders`)
      .set('x-api-token', token)
      .send({})
      .expect(422);

    expect(response.body.errors.name).toStrictEqual([
      "must have required property 'name'",
    ]);
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
});
