import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createAgent } from '@/factories/agent.js';
import { createPermission } from '@/factories/permission.js';
import updateAgentMock from '@/mocks/rest/internal/api/v1/agents/update-agent.js';

describe('PATCH /internal/api/v1/agents/:agentId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the updated agent data of current user', async () => {
    const currentUserAgent = await createAgent({ userId: currentUser.id });

    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
    });

    const response = await request(app)
      .patch(`/internal/api/v1/agents/${currentUserAgent.id}`)
      .set('Authorization', token)
      .send({
        name: 'Updated agent name',
        description: 'Updated description',
        instructions: 'Updated instructions',
      })
      .expect(200);

    const refetchedCurrentUserAgent = await currentUserAgent.$query();

    const expectedPayload = await updateAgentMock({
      ...refetchedCurrentUserAgent,
      name: 'Updated agent name',
      description: 'Updated description',
      instructions: 'Updated instructions',
    });

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return not found response for not existing agent UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
    });

    const notExistingAgentUUID = Crypto.randomUUID();

    await request(app)
      .patch(`/internal/api/v1/agents/${notExistingAgentUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid agent ID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
    });

    await request(app)
      .patch('/internal/api/v1/agents/invalidAgentID')
      .set('Authorization', token)
      .expect(400);
  });

  it('should return unprocessable entity response for invalid data', async () => {
    const currentUserAgent = await createAgent({ userId: currentUser.id });

    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
    });

    const response = await request(app)
      .patch(`/internal/api/v1/agents/${currentUserAgent.id}`)
      .set('Authorization', token)
      .send({
        name: null,
        instructions: null,
      })
      .expect(422);

    expect(response.body.errors).toStrictEqual({
      name: ['must be string'],
      instructions: ['must be string'],
    });

    expect(response.body.meta.type).toStrictEqual('ModelValidation');
  });
});
