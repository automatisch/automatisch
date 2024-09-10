import Crypto from 'node:crypto';
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../test/factories/user.js';
import { createFlow } from '../../../../../test/factories/flow.js';
import { createStep } from '../../../../../test/factories/step.js';
import createStepMock from '../../../../../test/mocks/rest/api/v1/flows/create-step.js';
import { createPermission } from '../../../../../test/factories/permission.js';

describe('POST /api/v1/flows/:flowId/steps', () => {
  let currentUser, flow, triggerStep, token;

  beforeEach(async () => {
    currentUser = await createUser();

    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'read',
    });

    await createPermission({
      roleId: currentUser.roleId,
      subject: 'Flow',
      action: 'update',
    });

    flow = await createFlow({ userId: currentUser.id });

    triggerStep = await createStep({ flowId: flow.id, type: 'trigger' });
    await createStep({ flowId: flow.id, type: 'action' });

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return created step', async () => {
    const response = await request(app)
      .post(`/api/v1/flows/${flow.id}/steps`)
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
    const anotherUsertoken = await createAuthTokenByUserId(anotherUser.id);

    await createPermission({
      roleId: anotherUser.roleId,
      subject: 'Flow',
      action: 'read',
      conditions: [],
    });

    await createPermission({
      roleId: anotherUser.roleId,
      subject: 'Flow',
      action: 'update',
      conditions: [],
    });

    const response = await request(app)
      .post(`/api/v1/flows/${flow.id}/steps`)
      .set('Authorization', anotherUsertoken)
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

  it('should return bad request response for invalid flow UUID', async () => {
    await request(app)
      .post('/api/v1/flows/invalidFlowUUID/steps')
      .set('Authorization', token)
      .send({
        previousStepId: triggerStep.id,
      })
      .expect(400);
  });

  it('should return not found response for invalid flow UUID', async () => {
    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .post(`/api/v1/flows/${notExistingFlowUUID}/steps`)
      .set('Authorization', token)
      .send({
        previousStepId: triggerStep.id,
      })
      .expect(404);
  });

  it('should return not found response for invalid flow UUID', async () => {
    const notExistingStepUUID = Crypto.randomUUID();

    await request(app)
      .post(`/api/v1/flows/${flow.id}/steps`)
      .set('Authorization', token)
      .send({
        previousStepId: notExistingStepUUID,
      })
      .expect(404);
  });
});
