import { describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createConnection } from '../../../../../../test/factories/connection.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import { createPermission } from '../../../../../../test/factories/permission.js';

describe('DELETE /internal/api/v1/steps/:stepId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should remove the step of the current user and return no content', async () => {
    const currentUserFlow = await createFlow({ userId: currentUser.id });
    const currentUserConnection = await createConnection();

    await createStep({
      flowId: currentUserFlow.id,
      connectionId: currentUserConnection.id,
    });

    const actionStep = await createStep({
      flowId: currentUserFlow.id,
      connectionId: currentUserConnection.id,
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

    await request(app)
      .delete(`/internal/api/v1/steps/${actionStep.id}`)
      .set('Authorization', token)
      .expect(204);
  });

  it('should remove the step of the another user and return no content', async () => {
    const anotherUser = await createUser();
    const anotherUserFlow = await createFlow({ userId: anotherUser.id });
    const anotherUserConnection = await createConnection();

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
      roleId: currentUserRole.id,
      conditions: [],
    });

    await createPermission({
      action: 'manage',
      subject: 'Flow',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .delete(`/internal/api/v1/steps/${actionStep.id}`)
      .set('Authorization', token)
      .expect(204);
  });

  it('should return not found response for not existing step UUID', async () => {
    await createPermission({
      action: 'manage',
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
      .delete(`/internal/api/v1/steps/${notExistingStepUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid step UUID', async () => {
    await createPermission({
      action: 'manage',
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
      .delete('/internal/api/v1/steps/invalidStepUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
