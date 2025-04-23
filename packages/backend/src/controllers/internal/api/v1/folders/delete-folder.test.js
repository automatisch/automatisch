import { describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFolder } from '../../../../../../test/factories/folder.js';
import { createPermission } from '../../../../../../test/factories/permission.js';

describe('DELETE /internal/api/v1/folders/:folderId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should remove the current user folder and return no content', async () => {
    const currentUserFolder = await createFolder({ userId: currentUser.id });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
    });

    await request(app)
      .delete(`/internal/api/v1/folders/${currentUserFolder.id}`)
      .set('Authorization', token)
      .expect(204);
  });

  it('should return not found response for not existing folder UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
    });

    const notExistingFolderUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/internal/api/v1/folders/${notExistingFolderUUID}`)
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
      .delete('/internal/api/v1/folders/invalidFolderUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
