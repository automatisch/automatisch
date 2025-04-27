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
  let user, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    user = await createUser();
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
    const folderOne = await createFolder({ userId: user.id });

    const userFlowOne = await createFlow({
      userId: user.id,
      folderId: folderOne.id,
    });

    const triggerStepFlowOne = await createStep({
      flowId: userFlowOne.id,
      type: 'trigger',
    });
    const actionStepFlowOne = await createStep({
      flowId: userFlowOne.id,
      type: 'action',
    });

    const folderTwo = await createFolder({ userId: user.id });

    const userFlowTwo = await createFlow({
      userId: user.id,
      folderId: folderTwo.id,
    });

    const triggerStepFlowTwo = await createStep({
      flowId: userFlowTwo.id,
      type: 'trigger',
    });

    const actionStepFlowTwo = await createStep({
      flowId: userFlowTwo.id,
      type: 'action',
    });

    await createFlow();

    const response = await request(app)
      .get(`/api/v1/flows?userId=${user.id}`)
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [userFlowTwo, userFlowOne],
      [
        triggerStepFlowOne,
        actionStepFlowOne,
        triggerStepFlowTwo,
        actionStepFlowTwo,
      ]
    );

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return all uncategorized flows data', async () => {
    const folderOne = await createFolder();

    const userFlowOne = await createFlow({
      userId: user.id,
      folderId: folderOne.id,
    });

    await createStep({
      flowId: userFlowOne.id,
      type: 'trigger',
    });

    await createStep({
      flowId: userFlowOne.id,
      type: 'action',
    });

    const folderTwo = await createFolder();

    const userFlowTwo = await createFlow({
      userId: user.id,
      folderId: folderTwo.id,
    });

    await createStep({
      flowId: userFlowTwo.id,
      type: 'trigger',
    });

    await createStep({
      flowId: userFlowTwo.id,
      type: 'action',
    });

    const userFlowThree = await createFlow();

    const triggerStepFlowThree = await createStep({
      flowId: userFlowThree.id,
      type: 'trigger',
    });

    const actionStepFlowThree = await createStep({
      flowId: userFlowThree.id,
      type: 'action',
    });

    const userFlowFour = await createFlow();

    const triggerStepFlowFour = await createStep({
      flowId: userFlowFour.id,
      type: 'trigger',
    });

    const actionStepFlowFour = await createStep({
      flowId: userFlowFour.id,
      type: 'action',
    });

    const response = await request(app)
      .get(`/api/v1/flows?folderId=null`)
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [userFlowFour, userFlowThree],
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
    const folderOne = await createFolder({ userId: user.id });

    const userFlowOne = await createFlow({
      userId: user.id,
      folderId: folderOne.id,
    });

    const triggerStepFlowOne = await createStep({
      flowId: userFlowOne.id,
      type: 'trigger',
    });
    const actionStepFlowOne = await createStep({
      flowId: userFlowOne.id,
      type: 'action',
    });

    const userFlowTwo = await createFlow({
      userId: user.id,
      folderId: folderOne.id,
    });

    const triggerStepFlowTwo = await createStep({
      flowId: userFlowTwo.id,
      type: 'trigger',
    });

    const actionStepFlowTwo = await createStep({
      flowId: userFlowTwo.id,
      type: 'action',
    });

    const folderTwo = await createFolder({ userId: user.id });

    const userFlowThree = await createFlow({
      userId: user.id,
      folderId: folderTwo.id,
    });

    await createStep({
      flowId: userFlowThree.id,
      type: 'trigger',
    });

    await createStep({
      flowId: userFlowThree.id,
      type: 'action',
    });

    const userFlowFour = await createFlow({ userId: user.id });

    await createStep({
      flowId: userFlowFour.id,
      type: 'trigger',
    });

    await createStep({
      flowId: userFlowFour.id,
      type: 'action',
    });

    const response = await request(app)
      .get(`/api/v1/flows?userId=${user.id}&folderId=${folderOne.id}`)
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [userFlowTwo, userFlowOne],
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
