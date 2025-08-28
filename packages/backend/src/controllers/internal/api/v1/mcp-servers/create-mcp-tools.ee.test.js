import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';

import app from '../../../../../app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import { createUser } from '@/factories/user.js';
import { createPermission } from '@/factories/permission.js';
import { createConnection } from '@/factories/connection.js';
import { createMcpTool } from '@/factories/mcp-tool.js';
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
        actions: ['send-a-direct-message', 'find-message'],
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

    it('should replace existing app tool for same appKey', async () => {
      await createPermission({
        action: 'manage',
        subject: 'McpServer',
        roleId: currentUserRole.id,
        conditions: ['isCreator'],
      });

      // Create initial tool using factory
      const initialTool = await createMcpTool({
        serverId: mcpServer.id,
        connectionId: connection.id,
        appKey: 'slack',
        actions: ['send-a-direct-message'],
      });

      // Verify initial tool exists
      const initialTools = await mcpServer
        .$relatedQuery('tools')
        .where('app_key', 'slack');
      expect(initialTools).toHaveLength(1);

      // Create replacement tool with same appKey but different connection
      const anotherConnection = await createConnection({
        userId: currentUser.id,
        key: 'slack',
      });

      const replacementToolData = {
        connectionId: anotherConnection.id,
        appKey: 'slack',
        actions: ['send-a-direct-message', 'find-message'],
      };

      const response = await request(app)
        .post(`/internal/api/v1/mcp-servers/${mcpServer.id}/tools`)
        .set('Authorization', token)
        .send(replacementToolData)
        .expect(201);

      // Verify only one tool exists for the appKey and it has the new data
      const finalTools = await mcpServer
        .$relatedQuery('tools')
        .where('app_key', 'slack');
      expect(finalTools).toHaveLength(1);
      expect(finalTools[0].actions).toEqual(replacementToolData.actions);
      expect(finalTools[0].connectionId).toBe(replacementToolData.connectionId);
      expect(finalTools[0].id).not.toBe(initialTool.id); // Should be a new tool

      const refetchedMcpTool = await mcpServer
        .$relatedQuery('tools')
        .findById(response.body.data.id);

      const expectedPayload = await createMcpToolsMock(refetchedMcpTool);

      expect(response.body).toStrictEqual(expectedPayload);
    });
  });

  it('should return unprocessable entity response for missing required fields', async () => {
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
      actions: ['send-a-direct-message'],
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
      actions: ['send-a-direct-message'],
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

    it('should replace existing flow tool for same flowId', async () => {
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

      // Create initial flow tool
      const initialTool = await createMcpTool({
        serverId: mcpServer.id,
        type: 'flow',
        flowId: flow.id,
      });

      // Verify initial tool exists
      const initialTools = await mcpServer
        .$relatedQuery('tools')
        .where('flow_id', flow.id);
      expect(initialTools).toHaveLength(1);

      // Create replacement tool with same flowId
      const replacementToolData = {
        type: 'flow',
        flowId: flow.id,
      };

      const response = await request(app)
        .post(`/internal/api/v1/mcp-servers/${mcpServer.id}/tools`)
        .set('Authorization', token)
        .send(replacementToolData)
        .expect(201);

      // Verify only one tool exists for the flowId and it's a new tool
      const finalTools = await mcpServer
        .$relatedQuery('tools')
        .where('flow_id', flow.id);
      expect(finalTools).toHaveLength(1);
      expect(finalTools[0].id).not.toBe(initialTool.id);

      const refetchedMcpTool = await mcpServer
        .$relatedQuery('tools')
        .findById(response.body.data.id);

      const expectedPayload = await createMcpToolsMock(refetchedMcpTool);
      expect(response.body).toStrictEqual(expectedPayload);
    });
  });
});
