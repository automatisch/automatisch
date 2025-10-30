import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createAgent } from '@/factories/agent.js';
import getAgentsMock from '@/mocks/rest/internal/api/v1/agents/get-agents.js';

describe('GET /internal/api/v1/agents', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it("should return current user's agents", async () => {
    const userAgent = await createAgent({
      userId: currentUser.id,
      name: 'User Agent',
    });

    const anotherUser = await createUser();
    await createAgent({
      userId: anotherUser.id,
      name: 'Another User Agent',
    });

    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get('/internal/api/v1/agents')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getAgentsMock([userAgent]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
