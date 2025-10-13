import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createAgent } from '@/factories/agent.js';
import { createAgentExecution } from '@/factories/agent-execution.js';
import getAgentExecutionsMock from '@/mocks/rest/internal/api/v1/agents/get-agent-executions.js';

describe('GET /internal/api/v1/agents/:agentId/executions', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);

    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });
  });

  it("should return current user's agent executions", async () => {
    const userAgent = await createAgent({
      userId: currentUser.id,
      name: 'User Agent',
    });

    const userAgentExecution = await createAgentExecution({
      agentId: userAgent.id,
      prompt: 'Agent execution prompt',
      status: 'completed',
      output: 'Agent execution output',
    });

    const anotherUser = await createUser();

    await createAgent({
      userId: anotherUser.id,
      name: 'Another User Agent',
    });

    const response = await request(app)
      .get(`/internal/api/v1/agents/${userAgent.id}/executions`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getAgentExecutionsMock([userAgentExecution]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it("should return not found if agent doesn't exist", async () => {
    const notExistingAgentUUID = Crypto.randomUUID();

    await request(app)
      .get(`/internal/api/v1/agents/${notExistingAgentUUID}/executions`)
      .set('Authorization', token)
      .expect(404);
  });
});
