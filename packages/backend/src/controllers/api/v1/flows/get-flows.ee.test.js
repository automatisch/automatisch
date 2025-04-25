import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createFlow } from '../../../../../test/factories/flow.js';
import { createFolder } from '../../../../../test/factories/folder.js';
import { createStep } from '../../../../../test/factories/step.js';
import { createUser } from '../../../../../test/factories/user.js';
import getFlowsMock from '../../../../../test/mocks/rest/api/v1/flows/get-flows.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/flows', () => {
  let currentUser, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();
    token = (await createApiToken()).token;
  });

  it('should return the flows data', async () => {
    const flowOne = await createFlow();

    const triggerStepFlowOne = await createStep({
      flowId: flowOne.id,
      type: 'trigger',
    });
    const actionStepFlowOne = await createStep({
      flowId: flowOne.id,
      type: 'action',
    });

    const flowTwo = await createFlow();

    const triggerStepFlowTwo = await createStep({
      flowId: flowTwo.id,
      type: 'trigger',
    });
    const actionStepFlowTwo = await createStep({
      flowId: flowTwo.id,
      type: 'action',
    });

    const response = await request(app)
      .get('/api/v1/flows')
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [flowTwo, flowOne],
      [
        triggerStepFlowOne,
        actionStepFlowOne,
        triggerStepFlowTwo,
        actionStepFlowTwo,
      ]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return all flows data of the given user', async () => {
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

    const response = await request(app)
      .get('/api/v1/flows?userId=' + currentUser.id)
      .set('x-api-token', token)
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

  it('should return all uncategorized flows data', async () => {
    const folderOne = await createFolder();

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

    const folderTwo = await createFolder();

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

    const currentUserFlowThree = await createFlow();

    const triggerStepFlowThree = await createStep({
      flowId: currentUserFlowThree.id,
      type: 'trigger',
    });

    const actionStepFlowThree = await createStep({
      flowId: currentUserFlowThree.id,
      type: 'action',
    });

    const currentUserFlowFour = await createFlow();

    const triggerStepFlowFour = await createStep({
      flowId: currentUserFlowFour.id,
      type: 'trigger',
    });

    const actionStepFlowFour = await createStep({
      flowId: currentUserFlowFour.id,
      type: 'action',
    });

    const response = await request(app)
      .get(`/api/v1/flows?folderId=null`)
      .set('x-api-token', token)
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

  it('should return all flows data of the given user for specified folder', async () => {
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

    const response = await request(app)
      .get(`/api/v1/flows?userId=${currentUser.id}&folderId=${folderOne.id}`)
      .set('x-api-token', token)
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
