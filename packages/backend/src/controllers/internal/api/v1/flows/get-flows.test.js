import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import { createFolder } from '../../../../../../test/factories/folder.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import getFlowsMock from '../../../../../../test/mocks/rest/internal/api/v1/flows/get-flows.js';

describe('GET /internal/api/v1/flows', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the flows data of current user', async () => {
    const currentUserFlowOne = await createFlow({ userId: currentUser.id });

    const triggerStepFlowOne = await createStep({
      flowId: currentUserFlowOne.id,
      type: 'trigger',
    });
    const actionStepFlowOne = await createStep({
      flowId: currentUserFlowOne.id,
      type: 'action',
    });

    const currentUserFlowTwo = await createFlow({ userId: currentUser.id });

    const triggerStepFlowTwo = await createStep({
      flowId: currentUserFlowTwo.id,
      type: 'trigger',
    });
    const actionStepFlowTwo = await createStep({
      flowId: currentUserFlowTwo.id,
      type: 'action',
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get('/internal/api/v1/flows')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [currentUserFlowTwo, currentUserFlowOne],
      [
        triggerStepFlowOne,
        actionStepFlowOne,
        triggerStepFlowTwo,
        actionStepFlowTwo,
      ]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return the flows data of another user', async () => {
    const anotherUser = await createUser();

    const anotherUserFlowOne = await createFlow({ userId: anotherUser.id });

    const triggerStepFlowOne = await createStep({
      flowId: anotherUserFlowOne.id,
      type: 'trigger',
    });
    const actionStepFlowOne = await createStep({
      flowId: anotherUserFlowOne.id,
      type: 'action',
    });

    const anotherUserFlowTwo = await createFlow({ userId: anotherUser.id });

    const triggerStepFlowTwo = await createStep({
      flowId: anotherUserFlowTwo.id,
      type: 'trigger',
    });
    const actionStepFlowTwo = await createStep({
      flowId: anotherUserFlowTwo.id,
      type: 'action',
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .get('/internal/api/v1/flows')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [anotherUserFlowTwo, anotherUserFlowOne],
      [
        triggerStepFlowOne,
        actionStepFlowOne,
        triggerStepFlowTwo,
        actionStepFlowTwo,
      ]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return the all flows data of the current user', async () => {
    const folderOne = await createFolder({ userId: currentUser.id });

    const currentUserFlowOne = await createFlow({
      userId: currentUser.id,
      folderId: folderOne.id,
    });

    const triggerStepFlowOne = await createStep({
      flowId: currentUserFlowOne.id,
      type: 'trigger',
    });
    const actionStepFlowOne = await createStep({
      flowId: currentUserFlowOne.id,
      type: 'action',
    });

    const folderTwo = await createFolder({ userId: currentUser.id });

    const currentUserFlowTwo = await createFlow({
      userId: currentUser.id,
      folderId: folderTwo.id,
    });

    const triggerStepFlowTwo = await createStep({
      flowId: currentUserFlowTwo.id,
      type: 'trigger',
    });

    const actionStepFlowTwo = await createStep({
      flowId: currentUserFlowTwo.id,
      type: 'action',
    });

    const currentUserFlowThree = await createFlow({ userId: currentUser.id });

    const triggerStepFlowThree = await createStep({
      flowId: currentUserFlowThree.id,
      type: 'trigger',
    });

    const actionStepFlowThree = await createStep({
      flowId: currentUserFlowThree.id,
      type: 'action',
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get('/internal/api/v1/flows')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [currentUserFlowThree, currentUserFlowTwo, currentUserFlowOne],
      [
        triggerStepFlowOne,
        actionStepFlowOne,
        triggerStepFlowTwo,
        actionStepFlowTwo,
        triggerStepFlowThree,
        actionStepFlowThree,
      ]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return the uncategorized flows data of the current user', async () => {
    const folderOne = await createFolder({ userId: currentUser.id });

    const currentUserFlowOne = await createFlow({
      userId: currentUser.id,
      folderId: folderOne.id,
    });

    await createStep({
      flowId: currentUserFlowOne.id,
      type: 'trigger',
    });

    await createStep({
      flowId: currentUserFlowOne.id,
      type: 'action',
    });

    const folderTwo = await createFolder({ userId: currentUser.id });

    const currentUserFlowTwo = await createFlow({
      userId: currentUser.id,
      folderId: folderTwo.id,
    });

    await createStep({
      flowId: currentUserFlowTwo.id,
      type: 'trigger',
    });

    await createStep({
      flowId: currentUserFlowTwo.id,
      type: 'action',
    });

    const currentUserFlowThree = await createFlow({
      userId: currentUser.id,
    });

    const triggerStepFlowThree = await createStep({
      flowId: currentUserFlowThree.id,
      type: 'trigger',
    });

    const actionStepFlowThree = await createStep({
      flowId: currentUserFlowThree.id,
      type: 'action',
    });

    const currentUserFlowFour = await createFlow({ userId: currentUser.id });

    const triggerStepFlowFour = await createStep({
      flowId: currentUserFlowFour.id,
      type: 'trigger',
    });

    const actionStepFlowFour = await createStep({
      flowId: currentUserFlowFour.id,
      type: 'action',
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/internal/api/v1/flows?folderId=null`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [currentUserFlowFour, currentUserFlowThree],
      [
        triggerStepFlowThree,
        actionStepFlowThree,
        triggerStepFlowFour,
        actionStepFlowFour,
      ]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return the all flows data of the current user for specified folder', async () => {
    const folderOne = await createFolder({ userId: currentUser.id });

    const currentUserFlowOne = await createFlow({
      userId: currentUser.id,
      folderId: folderOne.id,
    });

    const triggerStepFlowOne = await createStep({
      flowId: currentUserFlowOne.id,
      type: 'trigger',
    });
    const actionStepFlowOne = await createStep({
      flowId: currentUserFlowOne.id,
      type: 'action',
    });

    const currentUserFlowTwo = await createFlow({
      userId: currentUser.id,
      folderId: folderOne.id,
    });

    const triggerStepFlowTwo = await createStep({
      flowId: currentUserFlowTwo.id,
      type: 'trigger',
    });

    const actionStepFlowTwo = await createStep({
      flowId: currentUserFlowTwo.id,
      type: 'action',
    });

    const folderTwo = await createFolder({ userId: currentUser.id });

    const currentUserFlowThree = await createFlow({
      userId: currentUser.id,
      folderId: folderTwo.id,
    });

    await createStep({
      flowId: currentUserFlowThree.id,
      type: 'trigger',
    });

    await createStep({
      flowId: currentUserFlowThree.id,
      type: 'action',
    });

    const currentUserFlowFour = await createFlow({ userId: currentUser.id });

    await createStep({
      flowId: currentUserFlowFour.id,
      type: 'trigger',
    });

    await createStep({
      flowId: currentUserFlowFour.id,
      type: 'action',
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/internal/api/v1/flows?folderId=${folderOne.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [currentUserFlowTwo, currentUserFlowOne],
      [
        triggerStepFlowOne,
        actionStepFlowOne,
        triggerStepFlowTwo,
        actionStepFlowTwo,
      ]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
