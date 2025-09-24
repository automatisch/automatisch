import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createConnection } from '@/factories/connection.js';
import { createFlow } from '@/factories/flow.js';
import createMcpToolsMock from '@/mocks/rest/internal/api/v1/mcp-servers/create-mcp-tools.js';

describe('POST /internal/api/v1/mcp-servers/:mcpServerId/tools', () => {
  let currentUser, currentUserRole, token, mcpServer, connection;

  beforeEach(async () => {
    currentUser = await createUser();
    currentUserRole = await currentUser.$relatedQuery('role');
    token = await createAuthTokenByUserId(currentUser.id);

    mcpServer = await currentUser.$relatedQuery('mcpServers').insertAndFetch({
      name: 'Test MCP Server',
    });

    connection = await createConnection({
      userId: currentUser.id,
      key: 'slack',
    });
  });

  describe('app-type tools', () => {
    it('should create a new app MCP tool successfully', async () => {
      await createPermission({
        action: 'manage',
        subject: 'McpServer',
        roleId: currentUserRole.id,
        conditions: ['isCreator'],
      });

      const toolData = {
        connectionId: connection.id,
        appKey: 'slack',
        action: 'send-a-direct-message',
      };

      const response = await request(app)
        .post(`/internal/api/v1/mcp-servers/${mcpServer.id}/tools`)
        .set('Authorization', token)
        .send(toolData)
        .expect(201);

      const refetchedMcpTool = await mcpServer
        .$relatedQuery('tools')
        .findById(response.body.data.id);

      const expectedPayload = await createMcpToolsMock(refetchedMcpTool);

      expect(response.body).toStrictEqual(expectedPayload);
    });
  });

  it('should return server error response for missing required fields', async () => {
    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    await request(app)
      .post(`/internal/api/v1/mcp-servers/${mcpServer.id}/tools`)
      .set('Authorization', token)
      .send({})
      .expect(500);
  });

  it('should return not found response for non-existing MCP server', async () => {
    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const notExistingMcpServerUUID = Crypto.randomUUID();

    const toolData = {
      connectionId: connection.id,
      appKey: 'slack',
      action: 'send-a-direct-message',
    };

    await request(app)
      .post(`/internal/api/v1/mcp-servers/${notExistingMcpServerUUID}/tools`)
      .set('Authorization', token)
      .send(toolData)
      .expect(404);
  });

  it('should return bad request response for invalid MCP server UUID', async () => {
    await createPermission({
      action: 'manage',
      subject: 'McpServer',
      roleId: currentUserRole.id,
      conditions: ['isCreator'],
    });

    const toolData = {
      connectionId: connection.id,
      appKey: 'slack',
      action: 'send-a-direct-message',
    };

    await request(app)
      .post('/internal/api/v1/mcp-servers/invalidMcpServerUUID/tools')
      .set('Authorization', token)
      .send(toolData)
      .expect(400);
  });

  describe('flow-type tools', () => {
    it('should create a new flow MCP tool successfully', async () => {
      await createPermission({
        action: 'manage',
        subject: 'McpServer',
        roleId: currentUserRole.id,
        conditions: ['isCreator'],
      });

      const flow = await createFlow({
        userId: currentUser.id,
        name: 'Test Flow',
        active: true,
      });

      // Create MCP trigger step for the flow
      await flow.$relatedQuery('steps').insert({
        type: 'trigger',
        position: 1,
        appKey: 'mcp',
        key: 'mcpTool',
        parameters: {
          toolName: 'test_flow_tool',
          toolDescription: 'A test flow tool',
          inputSchema:
            '{"type": "object", "properties": {"query": {"type": "string"}}}',
        },
      });

      const toolData = {
        type: 'flow',
        flowId: flow.id,
      };

      const response = await request(app)
        .post(`/internal/api/v1/mcp-servers/${mcpServer.id}/tools`)
        .set('Authorization', token)
        .send(toolData)
        .expect(201);

      const refetchedMcpTool = await mcpServer
        .$relatedQuery('tools')
        .findById(response.body.data.id);

      expect(refetchedMcpTool.type).toBe('flow');
      expect(refetchedMcpTool.flowId).toBe(flow.id);
      expect(refetchedMcpTool.connectionId).toBeNull();

      const expectedPayload = await createMcpToolsMock(refetchedMcpTool);
      expect(response.body).toStrictEqual(expectedPayload);
    });
  });
});
