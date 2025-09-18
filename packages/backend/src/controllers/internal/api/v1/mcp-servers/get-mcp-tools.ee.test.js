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
import getMcpToolsMock from '@/mocks/rest/internal/api/v1/mcp-servers/get-mcp-tools.js';

describe('GET /internal/api/v1/mcp-servers/:mcpServerId/tools', () => {
  let currentUser, currentUserRole, token, mcpServer;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');
    token = await createAuthTokenByUserId(currentUser.id);

    mcpServer = await createMcpServer({
      userId: currentUser.id,
      name: 'Test MCP Server',
    });
  });

  it('should return empty array when MCP server has no tools', async () => {
    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/internal/api/v1/mcp-servers/${mcpServer.id}/tools`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getMcpToolsMock([]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return MCP tools for server ordered by app_key', async () => {
    const connection = await createConnection({
      userId: currentUser.id,
    });

    const slackTool = await createMcpTool({
      mcpServerId: mcpServer.id,
      connectionId: connection.id,
      appKey: 'slack',
      action: 'sendMessageToChannel',
    });

    const clickupTool = await createMcpTool({
      mcpServerId: mcpServer.id,
      connectionId: connection.id,
      appKey: 'clickup',
      action: 'createTask',
    });

    const airtableTool = await createMcpTool({
      mcpServerId: mcpServer.id,
      connectionId: connection.id,
      appKey: 'airtable',
      action: 'createRecord',
    });

    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/internal/api/v1/mcp-servers/${mcpServer.id}/tools`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getMcpToolsMock([
      airtableTool,
      clickupTool,
      slackTool,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return only tools for the specified MCP server', async () => {
    const connection = await createConnection({
      userId: currentUser.id,
    });

    const tool1 = await createMcpTool({
      mcpServerId: mcpServer.id,
      connectionId: connection.id,
      appKey: 'slack',
      action: 'sendMessageToChannel',
    });

    const anotherMcpServer = await createMcpServer({
      userId: currentUser.id,
      name: 'Another MCP Server',
    });

    await createMcpTool({
      mcpServerId: anotherMcpServer.id,
      connectionId: connection.id,
      appKey: 'clickup',
      action: 'createTask',
    });

    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const response = await request(app)
      .get(`/internal/api/v1/mcp-servers/${mcpServer.id}/tools`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getMcpToolsMock([tool1]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it("should return not found response when trying to access another user's MCP server", async () => {
    const anotherUser = await createUser();
    const anotherUserMcpServer = await createMcpServer({
      userId: anotherUser.id,
      name: 'Another User MCP Server',
    });

    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .get(`/internal/api/v1/mcp-servers/${anotherUserMcpServer.id}/tools`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return not found response for non-existing MCP server UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: [],
    });

    const notExistingMcpServerUUID = Crypto.randomUUID();

    await request(app)
      .get(`/internal/api/v1/mcp-servers/${notExistingMcpServerUUID}/tools`)
      .set('Authorization', token)
      .expect(404);
  });

  it('should return bad request response for invalid MCP server UUID', async () => {
    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: [],
    });

    await request(app)
      .get('/internal/api/v1/mcp-servers/invalidMcpServerUUID/tools')
      .set('Authorization', token)
      .expect(400);
  });
});
