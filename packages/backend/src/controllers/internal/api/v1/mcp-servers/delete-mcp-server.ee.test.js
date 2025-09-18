import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createConnection } from '@/factories/connection.js';
import { createMcpTool } from '@/factories/mcp-tool.js';

describe('DELETE /internal/api/v1/mcp-servers/:mcpServerId', () => {
  let currentUser, currentUserRole, token;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');

    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should remove the current user MCP server and return no content', async () => {
    const mcpServer = await currentUser
      .$relatedQuery('mcpServers')
      .insertAndFetch({
        name: 'Test MCP Server',
      });

    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(`/internal/api/v1/mcp-servers/${mcpServer.id}`)
      .set('Authorization', token)
      .expect(204);

    // Verify the MCP server was actually deleted
    const deletedServer = await currentUser
      .$relatedQuery('mcpServers')
      .findById(mcpServer.id);

    expect(deletedServer).toBeUndefined();
  });

  it('should explicitly delete associated MCP tools before deleting server', async () => {
    const mcpServer = await currentUser
      .$relatedQuery('mcpServers')
      .insertAndFetch({
        name: 'Test MCP Server with Tools',
      });

    const connection = await createConnection({
      userId: currentUser.id,
      key: 'slack',
    });

    // Create some MCP tools for this server
    const tool1 = await createMcpTool({
      mcpServerId: mcpServer.id,
      connectionId: connection.id,
      appKey: 'slack',
      action: 'send-message',
    });

    const tool2 = await createMcpTool({
      mcpServerId: mcpServer.id,
      connectionId: connection.id,
      appKey: 'discord',
      action: 'create-channel',
    });

    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(`/internal/api/v1/mcp-servers/${mcpServer.id}`)
      .set('Authorization', token)
      .expect(204);

    // Verify the MCP server was deleted
    const deletedServer = await currentUser
      .$relatedQuery('mcpServers')
      .findById(mcpServer.id);

    expect(deletedServer).toBeUndefined();

    // Verify the MCP tools were explicitly deleted (not cascade)
    const McpTool = (await import('@/models/mcp-tool.ee.js')).default;
    const remainingTool1 = await McpTool.query().findById(tool1.id);
    const remainingTool2 = await McpTool.query().findById(tool2.id);

    expect(remainingTool1).toBeUndefined();
    expect(remainingTool2).toBeUndefined();
  });

  it('should return not found response for non-existing MCP server UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const notExistingMcpServerUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/internal/api/v1/mcp-servers/${notExistingMcpServerUUID}`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid MCP server UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete('/internal/api/v1/mcp-servers/invalidMcpServerUUID')
      .set('Authorization', token)
      .expect(400);
  });
});
