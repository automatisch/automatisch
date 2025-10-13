import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createAgent } from '@/factories/agent.js';

describe('DELETE /internal/api/v1/agents/:agentId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should remove the current user agent and return no content', async () => {
    const agent = await createAgent({
      userId: currentUser.id,
      name: 'Test Agent',
      description: 'Test Description',
      instructions: 'Test Instructions',
    });

    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(`/internal/api/v1/agents/${agent.id}`)
      .set('Authorization', token)
      .expect(204);

    const deletedAgent = await currentUser
      .$relatedQuery('agents')
      .findById(agent.id);

    expect(deletedAgent).toBeUndefined();
  });

  it('should return not found response for non-existing agent UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const notExistingAgentUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/internal/api/v1/agents/${notExistingAgentUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid agent UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete('/internal/api/v1/agents/invalidAgentUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
