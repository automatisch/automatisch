import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createRole } from '../../../../../../test/factories/role.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import { createConnection } from '../../../../../../test/factories/connection.js';
import getAppsMock from '../../../../../../test/mocks/rest/internal/api/v1/users/get-apps.js';

describe('GET /internal/api/v1/users/:userId/apps', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUserRole = await createRole();
    currentUser = await createUser({ roleId: currentUserRole.id });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return all apps of the current user', async () => {
    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const flowOne = await createFlow({ userId: currentUser.id });

    await createStep({
      flowId: flowOne.id,
      appKey: 'webhook',
    });

    const flowOneActionStepConnection = await createConnection({
      userId: currentUser.id,
      key: 'deepl',
      draft: false,
    });

    await createStep({
      connectionId: flowOneActionStepConnection.id,
      flowId: flowOne.id,
      appKey: 'deepl',
    });

    const flowTwo = await createFlow({ userId: currentUser.id });

    const flowTwoTriggerStepConnection = await createConnection({
      userId: currentUser.id,
      key: 'github',
      draft: false,
    });

    await createStep({
      connectionId: flowTwoTriggerStepConnection.id,
      flowId: flowTwo.id,
      appKey: 'github',
    });

    await createStep({
      flowId: flowTwo.id,
      appKey: 'slack',
    });

    const response = await request(app)
      .get(`/internal/api/v1/users/${currentUser.id}/apps`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAppsMock();
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return all apps of the another user', async () => {
    const anotherUser = await createUser();

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const flowOne = await createFlow({ userId: anotherUser.id });

    await createStep({
      flowId: flowOne.id,
      appKey: 'webhook',
    });

    const flowOneActionStepConnection = await createConnection({
      userId: anotherUser.id,
      key: 'deepl',
      draft: false,
    });

    await createStep({
      connectionId: flowOneActionStepConnection.id,
      flowId: flowOne.id,
      appKey: 'deepl',
    });

    const flowTwo = await createFlow({ userId: anotherUser.id });

    const flowTwoTriggerStepConnection = await createConnection({
      userId: anotherUser.id,
      key: 'github',
      draft: false,
    });

    await createStep({
      connectionId: flowTwoTriggerStepConnection.id,
      flowId: flowTwo.id,
      appKey: 'github',
    });

    await createStep({
      flowId: flowTwo.id,
      appKey: 'slack',
    });

    const response = await request(app)
      .get(`/internal/api/v1/users/${currentUser.id}/apps`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = getAppsMock();
    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return specified app of the current user', async () => {
    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const flowOne = await createFlow({ userId: currentUser.id });

    await createStep({
      flowId: flowOne.id,
      appKey: 'webhook',
    });

    const flowOneActionStepConnection = await createConnection({
      userId: currentUser.id,
      key: 'deepl',
      draft: false,
    });

    await createStep({
      connectionId: flowOneActionStepConnection.id,
      flowId: flowOne.id,
      appKey: 'deepl',
    });

    const flowTwo = await createFlow({ userId: currentUser.id });

    const flowTwoTriggerStepConnection = await createConnection({
      userId: currentUser.id,
      key: 'github',
      draft: false,
    });

    await createStep({
      connectionId: flowTwoTriggerStepConnection.id,
      flowId: flowTwo.id,
      appKey: 'github',
    });

    await createStep({
      flowId: flowTwo.id,
      appKey: 'slack',
    });

    const response = await request(app)
      .get(`/internal/api/v1/users/${currentUser.id}/apps?name=deepl`)
      .set('Authorization', token)
      .expect(200);

    expect(response.body.data.length).toStrictEqual(1);
    expect(response.body.data[0].key).toStrictEqual('deepl');
  });
});
