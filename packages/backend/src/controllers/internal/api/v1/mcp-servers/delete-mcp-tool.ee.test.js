import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import { createMcpTool } from '@/factories/mcp-tool.js';
import { createConnection } from '@/factories/connection.js';

describe('DELETE /internal/api/v1/mcp-servers/:mcpServerId/tools/:mcpToolId', () => {
  let currentUser, currentUserRole, token, mcpServer, connection;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');
    token = await createAuthTokenByUserId(currentUser.id);

    mcpServer = await createMcpServer({
      userId: currentUser.id,
      name: 'Test MCP Server',
    });

    connection = await createConnection({
      userId: currentUser.id,
    });
  });

  it('should delete MCP tool successfully', async () => {
    const mcpTool = await createMcpTool({
      mcpServerId: mcpServer.id,
      connectionId: connection.id,
      appKey: 'slack',
      action: 'sendMessageToChannel',
    });

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(
        `/internal/api/v1/mcp-servers/${mcpServer.id}/tools/${mcpTool.id}`
      )
      .set('Authorization', token)
      .expect(204);

    const deletedTool = await mcpServer
      .$relatedQuery('tools')
      .findById(mcpTool.id);

    expect(deletedTool).toBeUndefined();
  });

  it('should return not found response when trying to delete tool from different server', async () => {
    const anotherMcpServer = await createMcpServer({
      userId: currentUser.id,
      name: 'Another MCP Server',
    });

    const mcpTool = await createMcpTool({
      mcpServerId: anotherMcpServer.id,
      connectionId: connection.id,
      appKey: 'clickup',
      action: 'createTask',
    });

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(
        `/internal/api/v1/mcp-servers/${mcpServer.id}/tools/${mcpTool.id}`
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not found response for non-existing MCP tool UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const notExistingMcpToolUUID = Crypto.randomUUID();

    await request(app)
      .delete(
        `/internal/api/v1/mcp-servers/${mcpServer.id}/tools/${notExistingMcpToolUUID}`
      )
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid MCP tool UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(
        `/internal/api/v1/mcp-servers/${mcpServer.id}/tools/invalidMcpToolUUID`
      )
      .set('Authorization', token)
      .expect(400);
  });

  it('should return bad request response for invalid MCP server UUID', async () => {
    const mcpTool = await createMcpTool({
      mcpServerId: mcpServer.id,
      connectionId: connection.id,
      appKey: 'slack',
      action: 'sendMessageToChannel',
    });

    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .delete(
        `/internal/api/v1/mcp-servers/invalidMcpServerUUID/tools/${mcpTool.id}`
      )
      .set('Authorization', token)
      .expect(400);
  });
});
