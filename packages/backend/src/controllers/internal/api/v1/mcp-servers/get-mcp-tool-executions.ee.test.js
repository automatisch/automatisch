import { describe, it, expect, beforeEach } from 'vitest';
import Crypto from 'node:crypto';
import request from 'supertest';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import { createMcpTool } from '@/factories/mcp-tool.js';
import { createMcpToolExecution } from '@/factories/mcp-tool-execution.js';
import getMcpToolExecutionsMock from '@/mocks/rest/internal/api/v1/mcp-servers/get-mcp-tool-executions.js';

describe('GET /internal/api/v1/mcp-servers/:mcpServerId/executions', () => {
  let currentUser, currentUserRole, token, mcpServer, mcpTool;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');
    token = await createAuthTokenByUserId(currentUser.id);
    mcpServer = await createMcpServer({ userId: currentUser.id });
    mcpTool = await createMcpTool({ mcpServerId: mcpServer.id });

    await createPermission({
      action: 'read',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });
  });

  it('should return paginated executions for MCP server', async () => {
    const mcpToolExecutionOne = await createMcpToolExecution({
      mcpToolId: mcpTool.id,
      status: 'success',
    });
    const mcpToolExecutionTwo = await createMcpToolExecution({
      mcpToolId: mcpTool.id,
      status: 'failure',
    });

    const response = await request(app)
      .get(`/internal/api/v1/mcp-servers/${mcpServer.id}/executions`)
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getMcpToolExecutionsMock([
      mcpToolExecutionTwo,
      mcpToolExecutionOne,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return 404 for non-existent MCP server', async () => {
    await request(app)
      .get(`/internal/api/v1/mcp-servers/${Crypto.randomUUID()}/executions`)
      .set('Authorization', token)
      .expect(404);
  });

  it("should return 404 when trying to access another user's MCP server executions", async () => {
    const anotherUser = await createUser();
    const anotherUserMcpServer = await createMcpServer({
      userId: anotherUser.id,
    });

    await request(app)
      .get(`/internal/api/v1/mcp-servers/${anotherUserMcpServer.id}/executions`)
      .set('Authorization', token)
      .expect(404);
  });
});
