import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import { createFlow } from '../../../../../test/factories/flow';
import { createStep } from '../../../../../test/factories/step';
import { createPermission } from '../../../../../test/factories/permission';
import { createFolder } from '../../../../../test/factories/folder';
import getFolderMock from '../../../../../test/mocks/rest/api/v1/flows/get-folder';

describe('GET /api/v1/flows/:flowId/folder', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the folder data of current user', async () => {
    const folder = await createFolder({ userId: currentUser.id });

    const currentUserFlow = await createFlow({
      userId: currentUser.id,
      folderId: folder.id,
    });

    await createStep({ flowId: currentUserFlow.id });
    await createStep({ flowId: currentUserFlow.id });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
    });

    const response = await request(app)
      .get(`/api/v1/flows/${currentUserFlow.id}/folder`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFolderMock(folder);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing flow UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/flows/${notExistingFlowUUID}/folder`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .get('/api/v1/flows/invalidFlowUUID/folder')
      .set('Authorization', token)
      .expect(400);
  });
});
