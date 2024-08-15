import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import { createFlow } from '../../../../../test/factories/flow';
import { createStep } from '../../../../../test/factories/step';
import { createPermission } from '../../../../../test/factories/permission';
import createDynamicFieldsMock from '../../../../../test/mocks/rest/api/v1/steps/create-dynamic-fields';

describe('POST /api/v1/steps/:stepId/dynamic-fields', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return dynamically created fields of the current users step', async () => {
    const currentUserflow = await createFlow({ userId: currentUser.id });

    const actionStep = await createStep({
      flowId: currentUserflow.id,
      type: 'action',
      appKey: 'slack',
      key: 'sendMessageToChannel',
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'update',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post(`/api/v1/steps/${actionStep.id}/dynamic-fields`)
      .set('Authorization', token)
      .send({
        dynamicFieldsKey: 'listFieldsAfterSendAsBot',
        parameters: {
          sendAsBot: true,
        },
      })
      .expect(200);

    const expectedPayload = await createDynamicFieldsMock();

    expect(response.body).toEqual(expectedPayload);
  });

  it('should return dynamically created fields of the another users step', async () => {
    const anotherUser = await createUser();
    const anotherUserflow = await createFlow({ userId: anotherUser.id });

    const actionStep = await createStep({
      flowId: anotherUserflow.id,
      type: 'action',
      appKey: 'slack',
      key: 'sendMessageToChannel',
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'update',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .post(`/api/v1/steps/${actionStep.id}/dynamic-fields`)
      .set('Authorization', token)
      .send({
        dynamicFieldsKey: 'listFieldsAfterSendAsBot',
        parameters: {
          sendAsBot: true,
        },
      })
      .expect(200);

    const expectedPayload = await createDynamicFieldsMock();

    expect(response.body).toEqual(expectedPayload);
  });

  it('should return not found response for not existing step UUID', async () => {
    await createPermission({
      action: 'update',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingStepUUID = Crypto.randomUUID();

    await request(app)
      .get(`/api/v1/steps/${notExistingStepUUID}/dynamic-fields`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not found response for existing step UUID without app key', async () => {
    await createPermission({
      action: 'update',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const step = await createStep({ appKey: null });

    await request(app)
      .get(`/api/v1/steps/${step.id}/dynamic-fields`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await createPermission({
      action: 'update',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .post('/api/v1/steps/invalidStepUUID/dynamic-fields')
      .set('Authorization', token)
      .expect(400);
  });
});
