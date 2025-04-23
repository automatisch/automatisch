import { describe, it, beforeEach, expect } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createConnection } from '../../../../../../test/factories/connection.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import { createPermission } from '../../../../../../test/factories/permission.js';
import updateStepMock from '../../../../../../test/mocks/rest/internal/api/v1/steps/update-step.js';

describe('PATCH /internal/api/v1/steps/:stepId', () => {
  let currentUser, token;

  beforeEach(async () => {
    currentUser = await createUser();

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should update the step of the current user', async () => {
    const currentUserFlow = await createFlow({ userId: currentUser.id });
    const currentUserConnection = await createConnection({
      key: 'deepl',
    });

    await createStep({
      flowId: currentUserFlow.id,
      connectionId: currentUserConnection.id,
    });

    const actionStep = await createStep({
      flowId: currentUserFlow.id,
      connectionId: currentUserConnection.id,
      appKey: 'deepl',
      key: 'translateText',
      name: 'Translate text',
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .patch(`/internal/api/v1/steps/${actionStep.id}`)
      .set('Authorization', token)
      .send({
        parameters: {
          text: 'Hello world!',
          targetLanguage: 'de',
          name: 'Translate text - Updated step name',
        },
      })
      .expect(200);

    const refetchedStep = await actionStep.$query();

    const expectedResponse = updateStepMock(refetchedStep);

    expect(response.body).toStrictEqual(expectedResponse);
  });

  it('should update the step of the another user', async () => {
    const anotherUser = await createUser();
    const anotherUserFlow = await createFlow({ userId: anotherUser.id });
    const anotherUserConnection = await createConnection({
      key: 'deepl',
    });

    await createStep({
      flowId: anotherUserFlow.id,
      connectionId: anotherUserConnection.id,
    });

    const actionStep = await createStep({
      flowId: anotherUserFlow.id,
      connectionId: anotherUserConnection.id,
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: [],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: [],
    });

    const response = await request(app)
      .patch(`/internal/api/v1/steps/${actionStep.id}`)
      .set('Authorization', token)
      .send({
        parameters: {
          text: 'Hello world!',
          targetLanguage: 'de',
        },
      })
      .expect(200);

    const refetchedStep = await actionStep.$query();

    const expectedResponse = updateStepMock(refetchedStep);

    expect(response.body).toStrictEqual(expectedResponse);
  });

  it('should return not found response for inaccessible connection', async () => {
    const currentUserFlow = await createFlow({ userId: currentUser.id });

    const anotherUser = await createUser();
    const anotherUserConnection = await createConnection({
      key: 'deepl',
      userId: anotherUser.id,
    });

    await createStep({
      flowId: currentUserFlow.id,
    });

    const actionStep = await createStep({
      flowId: currentUserFlow.id,
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'read',
      subject: 'Connection',
      roleId: currentUser.roleId,
      conditions: ['isCreator'],
    });

    await request(app)
      .patch(`/internal/api/v1/steps/${actionStep.id}`)
      .set('Authorization', token)
      .send({
        connectionId: anotherUserConnection.id,
      })
      .expect(404);
  });

  it('should return not found response for not existing step UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: [],
    });

    const notExistingStepUUID = Crypto.randomUUID();

    await request(app)
      .patch(`/internal/api/v1/steps/${notExistingStepUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid step UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: [],
    });

    await createPermission({
      action: 'read',
      subject: 'Flow',
      roleId: currentUser.roleId,
      conditions: [],
    });

    await request(app)
      .patch('/internal/api/v1/steps/invalidStepUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
