import { vi, describe, it, beforeEach, expect } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createAgent } from '@/factories/agent.js';
import { createAgentTool } from '@/factories/agent-tool.js';
import { createPermission } from '@/factories/permission.js';
import AgentTool from '@/models/agent-tool.ee.js';
import * as license from '@/helpers/license.ee.js';

describe('DELETE /internal/api/v1/agents/:agentId/tools/:toolId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');
    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should delete the agent tool and return no content', async () => {
    const agent = await createAgent({ userId: currentUser.id });
    const agentTool = await createAgentTool({ agentId: agent.id });

    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(`/internal/api/v1/agents/${agent.id}/tools/${agentTool.id}`)
      .set('Authorization', token)
      .expect(204);

    // Verify the tool was deleted
    const deletedTool = await AgentTool.query().findById(agentTool.id);
    expect(deletedTool).toBeUndefined();
  });

  it('should return 404 when agent does not exist', async () => {
    const nonExistentAgentId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const nonExistentToolId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(
        `/internal/api/v1/agents/${nonExistentAgentId}/tools/${nonExistentToolId}`
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return 404 when tool does not exist', async () => {
    const agent = await createAgent({ userId: currentUser.id });
    const nonExistentToolId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(`/internal/api/v1/agents/${agent.id}/tools/${nonExistentToolId}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return 404 when tool belongs to different agent', async () => {
    const agent1 = await createAgent({ userId: currentUser.id });
    const agent2 = await createAgent({ userId: currentUser.id });
    const agentTool = await createAgentTool({ agentId: agent2.id });

    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(`/internal/api/v1/agents/${agent1.id}/tools/${agentTool.id}`)
      .set('Authorization', token)
      .expect(404);

    // Verify the tool was NOT deleted
    const stillExistingTool = await AgentTool.query().findById(agentTool.id);
    expect(stillExistingTool).toBeDefined();
  });

  it('should return 403 when user does not own the agent', async () => {
    const anotherUser = await createUser();
    const anotherUserAgent = await createAgent({ userId: anotherUser.id });
    const agentTool = await createAgentTool({ agentId: anotherUserAgent.id });

    await createPermission({
      action: 'read',
      subject: 'Agent',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(
        `/internal/api/v1/agents/${anotherUserAgent.id}/tools/${agentTool.id}`
      )
      .set('Authorization', token)
      .expect(403);
  });
});
