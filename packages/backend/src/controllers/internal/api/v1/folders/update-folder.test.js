import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFolder } from '../../../../../../test/factories/folder.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import updateFolderMock from '../../../../../../test/mocks/rest/internal/api/v1/folders/update-folder.js';

describe('PATCH /internal/api/v1/folders/:folderId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the updated folder data of current user', async () => {
    const currentUserFolder = await createFolder({ userId: currentUser.id });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
    });

    const response = await request(app)
      .patch(`/internal/api/v1/folders/${currentUserFolder.id}`)
      .set('Authorization', token)
      .send({
        name: 'Updated folder name',
      })
      .expect(200);

    const refetchedCurrentUserFolder = await currentUserFolder.$query();

    const expectedPayload = await updateFolderMock({
      ...refetchedCurrentUserFolder,
      name: 'Updated folder name',
    });

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing folder UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
    });

    const notExistingFolderUUID = Crypto.randomUUID();

    await request(app)
      .patch(`/internal/api/v1/folders/${notExistingFolderUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
    });

    await request(app)
      .patch('/internal/api/v1/folders/invalidFolderUUID')
      .set('Authorization', token)
      .expect(400);
  });

  it('should return unprocessable entity response for invalid data', async () => {
    const currentUserFolder = await createFolder({ userId: currentUser.id });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
    });

    const response = await request(app)
      .patch(`/internal/api/v1/folders/${currentUserFolder.id}`)
      .set('Authorization', token)
      .send({
        name: null,
      })
      .expect(422);

    expect(response.body.errors).toStrictEqual({
      name: ['must be string'],
    });

    expect(response.body.meta.type).toStrictEqual('ModelValidation');
  });
});
