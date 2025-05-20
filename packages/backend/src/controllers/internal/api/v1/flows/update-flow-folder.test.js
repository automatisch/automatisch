import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createFolder } from '../../../../../../test/factories/folder.js';
import { createStep } from '../../../../../../test/factories/step.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import updateFlowFolderMock from '../../../../../../test/mocks/rest/internal/api/v1/flows/update-flow-folder.js';

describe('PATCH /internal/api/v1/flows/:flowId/folder', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return updated flow data of current user', async () => {
    const currentUserFlow = await createFlow({
      userId: currentUser.id,
      active: false,
    });

    const triggerStep = await createStep({
      flowId: currentUserFlow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
    });

    await createStep({
      flowId: currentUserFlow.id,
      type: 'action',
      appKey: 'ntfy',
      key: 'sendMessage',
      parameters: {
        topic: 'Test notification',
        message: `Message: {{step.${triggerStep.id}.body.message}} by {{step.${triggerStep.id}.body.sender}}`,
      },
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const folder = await createFolder({
      name: 'test',
      userId: currentUser.id,
    });

    const response = await request(app)
      .patch(`/internal/api/v1/flows/${currentUserFlow.id}/folder`)
      .set('Authorization', token)
      .send({ folderId: folder.id })
      .expect(200);

    const refetchedFlow = await currentUser
      .$relatedQuery('flows')
      .findById(response.body.data.id);

    const expectedPayload = await updateFlowFolderMock(refetchedFlow, folder);

    expect(response.body).toStrictEqual(expectedPayload);
    expect(response.body.data.folder.name).toStrictEqual('test');
  });

  it('should return not found response for other user flows', async () => {
    const anotherUser = await createUser();
    const anotherUserFlow = await createFlow({ userId: anotherUser.id });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .patch(`/internal/api/v1/flows/${anotherUserFlow.id}/folder`)
      .set('Authorization', token)
      .send({ folderId: 12345 })
      .expect(404);
  });

  it('should return not found response for other user folders', async () => {
    const flow = await createFlow({ userId: currentUser.id });
    const anotherUser = await createUser();
    const anotherUserFolder = await createFolder({ userId: anotherUser.id });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .patch(`/internal/api/v1/flows/${flow.id}/folder`)
      .set('Authorization', token)
      .send({ folderId: anotherUserFolder.id })
      .expect(404);
  });

  it('should return not found response for not existing flow UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .patch(`/internal/api/v1/flows/${notExistingFlowUUID}/folder`)
      .set('Authorization', token)
      .send({ folderId: 12345 })
      .expect(404);
  });

  it('should return not found response for not existing folder UUID', async () => {
    const flow = await createFlow({ userId: currentUser.id });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const notExistingFolderUUID = Crypto.randomUUID();

    await request(app)
      .patch(`/internal/api/v1/flows/${flow.id}/folder`)
      .set('Authorization', token)
      .send({ folderId: notExistingFolderUUID })
      .expect(404);
  });

  it('should return bad request response for invalid flow UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
    });

    await request(app)
      .patch('/internal/api/v1/flows/invalidFlowUUID/folder')
      .set('Authorization', token)
      .expect(400);
  });

  it('should return bad request response for invalid folder UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
    });

    const flow = await createFlow({ userId: currentUser.id });

    await request(app)
      .patch(`/internal/api/v1/flows/${flow.id}/folder`)
      .set('Authorization', token)
      .send({ folderId: 'invalidFolderUUID' })
      .expect(400);
  });
});
