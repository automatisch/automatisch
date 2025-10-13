import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createAgent } from '@/factories/agent.js';
import getAgentMock from '@/mocks/rest/internal/api/v1/agents/get-agent.js';

describe('GET /internal/api/v1/agents/:agentId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return the agent data for current user', async () => {
    const agent = await createAgent({
      userId: currentUser.id,
      name: 'Test Agent',
      description: 'Test Description',
      instructions: 'Test Instructions',
    });

    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/internal/api/v1/agents/${agent.id}`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getAgentMock(agent);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it("should return not found response when trying to access another user's agent", async () => {
    const anotherUser = await createUser();
    const anotherUserAgent = await createAgent({
      userId: anotherUser.id,
      name: 'Another User Agent',
    });

    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .get(`/internal/api/v1/agents/${anotherUserAgent.id}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not found response for non-existing agent UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingAgentUUID = Crypto.randomUUID();

    await request(app)
      .get(`/internal/api/v1/agents/${notExistingAgentUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid agent UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .get('/internal/api/v1/agents/invalidAgentUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
