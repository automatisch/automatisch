import Crypto from 'node:crypto';
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import createStepMock from '../../../../../../test/mocks/rest/internal/api/v1/flows/create-step.js';
import { createPermission } from '../../../../../../test/factories/permission.js';

describe('POST /internal/api/v1/flows/:flowId/steps', () => {
  let currentUser, flow, triggerStep, token;

  beforeEach(async () => {
    currentUser = await createUser();

    flow = await createFlow({ userId: currentUser.id });

    triggerStep = await createStep({ flowId: flow.id, type: 'trigger' });

    await createStep({ flowId: flow.id, type: 'action' });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return created step for current user', async () => {
    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'read',
      conditions: ['isCreator'],
    });

    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'manage',
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .post(`/internal/api/v1/flows/${flow.id}/steps`)
      .set('Authorization', token)
      .send({
        previousStepId: triggerStep.id,
      })
      .expect(201);

    const expectedPayload = await createStepMock({
      id: response.body.data.id,
      position: 2,
    });

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return created step for another user', async () => {
    const anotherUser = await createUser();

    const anotherUserFlow = await createFlow({ userId: anotherUser.id });

    const anotherUserFlowTriggerStep = await createStep({
      flowId: anotherUserFlow.id,
      type: 'trigger',
    });

    await createStep({ flowId: anotherUserFlow.id, type: 'action' });

    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'read',
      conditions: [],
    });

    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'manage',
      conditions: [],
    });

    const response = await request(app)
      .post(`/internal/api/v1/flows/${anotherUserFlow.id}/steps`)
      .set('Authorization', token)
      .send({
        previousStepId: anotherUserFlowTriggerStep.id,
      })
      .expect(201);

    const expectedPayload = await createStepMock({
      id: response.body.data.id,
      position: 2,
    });

    expect(response.body).toMatchObject(expectedPayload);
  });

  it('should return bad request response for invalid flow UUID', async () => {
    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'read',
      conditions: ['isCreator'],
    });

    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'manage',
      conditions: ['isCreator'],
    });

    await request(app)
      .post('/internal/api/v1/flows/invalidFlowUUID/steps')
      .set('Authorization', token)
      .send({
        previousStepId: triggerStep.id,
      })
      .expect(400);
  });

  it('should return not found response for invalid flow UUID', async () => {
    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'read',
      conditions: ['isCreator'],
    });

    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'manage',
      conditions: ['isCreator'],
    });

    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .post(`/internal/api/v1/flows/${notExistingFlowUUID}/steps`)
      .set('Authorization', token)
      .send({
        previousStepId: triggerStep.id,
      })
      .expect(404);
  });

  it('should return not found response for invalid flow UUID', async () => {
    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'read',
      conditions: ['isCreator'],
    });

    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'manage',
      conditions: ['isCreator'],
    });

    const notExistingStepUUID = Crypto.randomUUID();

    await request(app)
      .post(`/internal/api/v1/flows/${flow.id}/steps`)
      .set('Authorization', token)
      .send({
        previousStepId: notExistingStepUUID,
      })
      .expect(404);
  });
});
