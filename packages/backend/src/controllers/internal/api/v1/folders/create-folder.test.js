import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import createFolderMock from '../../../../../../test/mocks/rest/internal/api/v1/folders/create-folder.js';
import { createPermission } from '../../../../../../test/factories/permission.js';

describe('POST /internal/api/v1/folders', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return created folder', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post('/internal/api/v1/folders')
      .set('Authorization', token)
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
});
