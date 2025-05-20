import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import exportFlowMock from '../../../../../../test/mocks/rest/internal/api/v1/flows/export-flow.js';

describe('POST /internal/api/v1/flows/:flowId/export', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should export the flow data of the current user', async () => {
    const currentUserFlow = await createFlow({ userId: currentUser.id });

    const triggerStep = await createStep({
      flowId: currentUserFlow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'Catch raw webhook',
      parameters: {
        workSynchronously: true,
      },
      position: 1,
      webhookPath: `/webhooks/flows/${currentUserFlow.id}/sync`,
    });

    const actionStep = await createStep({
      flowId: currentUserFlow.id,
      type: 'action',
      appKey: 'formatter',
      key: 'text',
      name: 'Text',
      parameters: {
        input: `hello {{step.${triggerStep.id}.query.sample}} world`,
        transform: 'capitalize',
      },
      position: 2,
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post(`/internal/api/v1/flows/${currentUserFlow.id}/export`)
      .set('Authorization', token)
      .expect(201);

    const expectedPayload = await exportFlowMock(currentUserFlow, [
      triggerStep,
      actionStep,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should export the flow data of another user', async () => {
    const anotherUser = await createUser();
    const anotherUserFlow = await createFlow({ userId: anotherUser.id });

    const triggerStep = await createStep({
      flowId: anotherUserFlow.id,
      type: 'trigger',
      appKey: 'webhook',
      key: 'catchRawWebhook',
      name: 'Catch raw webhook',
      parameters: {
        workSynchronously: true,
      },
      position: 1,
      webhookPath: `/webhooks/flows/${anotherUserFlow.id}/sync`,
    });

    const actionStep = await createStep({
      flowId: anotherUserFlow.id,
      type: 'action',
      appKey: 'formatter',
      key: 'text',
      name: 'Text',
      parameters: {
        input: `hello {{step.${triggerStep.id}.query.sample}} world`,
        transform: 'capitalize',
      },
      position: 2,
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const response = await request(app)
      .post(`/internal/api/v1/flows/${anotherUserFlow.id}/export`)
      .set('Authorization', token)
      .expect(201);

    const expectedPayload = await exportFlowMock(anotherUserFlow, [
      triggerStep,
      actionStep,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing flow UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .post(`/internal/api/v1/flows/${notExistingFlowUUID}/export`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not found response for unauthorized flow', async () => {
    const anotherUser = await createUser();
    const anotherUserFlow = await createFlow({ userId: anotherUser.id });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .post(`/internal/api/v1/flows/${anotherUserFlow.id}/export`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .post('/internal/api/v1/flows/invalidFlowUUID/export')
      .set('Authorization', token)
      .expect(400);
  });
});
