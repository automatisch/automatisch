import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createConnection } from '../../../../../test/factories/connection.js';
import { createFlow } from '../../../../../test/factories/flow.js';
import { createStep } from '../../../../../test/factories/step.js';
import { createPermission } from '../../../../../test/factories/permission.js';
import getFlowsMock from '../../../../../test/mocks/rest/api/v1/flows/get-flows.js';

describe('GET /api/v1/connections/:connectionId/flows', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the flows data of specified connection for current user', async () => {
    const currentUserFlowOne = await createFlow({ userId: currentUser.id });

    const currentUserConnection = await createConnection({
      userId: currentUser.id,
      key: 'webhook',
    });

    const triggerStepFlowOne = await createStep({
      flowId: currentUserFlowOne.id,
      type: 'trigger',
      appKey: 'webhook',
      connectionId: currentUserConnection.id,
    });

    const actionStepFlowOne = await createStep({
      flowId: currentUserFlowOne.id,
      type: 'action',
    });

    const currentUserFlowTwo = await createFlow({ userId: currentUser.id });

    await createStep({
      flowId: currentUserFlowTwo.id,
      type: 'trigger',
      appKey: 'github',
    });

    await createStep({
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
      .get(`/api/v1/connections/${currentUserConnection.id}/flows`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [currentUserFlowOne],
      [triggerStepFlowOne, actionStepFlowOne]
    );

    expect(response.body).toEqual(expectedPayload);
  });

  it('should return the flows data of specified connection for another user', async () => {
    const anotherUser = await createUser();
    const anotherUserFlowOne = await createFlow({ userId: anotherUser.id });

    const anotherUserConnection = await createConnection({
      userId: anotherUser.id,
      key: 'webhook',
    });

    const triggerStepFlowOne = await createStep({
      flowId: anotherUserFlowOne.id,
      type: 'trigger',
      appKey: 'webhook',
      connectionId: anotherUserConnection.id,
    });

    const actionStepFlowOne = await createStep({
      flowId: anotherUserFlowOne.id,
      type: 'action',
    });

    const anotherUserFlowTwo = await createFlow({ userId: anotherUser.id });

    await createStep({
      flowId: anotherUserFlowTwo.id,
      type: 'trigger',
      appKey: 'github',
    });

    await createStep({
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
      .get(`/api/v1/connections/${anotherUserConnection.id}/flows`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getFlowsMock(
      [anotherUserFlowOne],
      [triggerStepFlowOne, actionStepFlowOne]
    );

    expect(response.body).toEqual(expectedPayload);
  });
});
