import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import { createFlow } from '../../../../../test/factories/flow';
import { createStep } from '../../../../../test/factories/step';
import { createPermission } from '../../../../../test/factories/permission';
import getFlowsMock from '../../../../../test/mocks/rest/api/v1/flows/get-flows.js';

describe('GET /api/v1/flows', () => {
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
      .get('/api/v1/flows')
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

    expect(response.body).toEqual(expectedPayload);
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
      .get('/api/v1/flows')
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

    expect(response.body).toEqual(expectedPayload);
  });
});
