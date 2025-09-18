import { describe, it, expect, vi } from 'vitest';
import Crypto from 'node:crypto';

import Base from '@/models/base.js';
import User from '@/models/user.js';
import McpTool from '@/models/mcp-tool.ee.js';
import McpToolExecutions from '@/models/mcp-tool-execution.ee.js';
import McpSession from '@/models/mcp-session.ee.js';
import McpServer from '@/models/mcp-server.ee.js';
import appConfig from '@/config/app.js';
import { createUser } from '@/factories/user.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import { createMcpTool } from '@/factories/mcp-tool.js';
import { createMcpSession } from '@/factories/mcp-session.js';
import { createConnection } from '@/factories/connection.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';

describe('McpServer model', () => {
  it('tableName should return correct name', () => {
    expect(McpServer.tableName).toBe('mcp_servers');
  });

  it('jsonSchema should have correct validations', () => {
    expect(McpServer.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = McpServer.relationMappings();

    const expectedRelations = {
      mcpToolExecutions: {
        join: {
          from: 'mcp_servers.id',
          through: {
            from: 'mcp_tools.mcp_server_id',
            to: 'mcp_tools.id',
          },
          to: 'mcp_tool_executions.mcp_tool_id',
        },
        modelClass: McpToolExecutions,
        relation: Base.ManyToManyRelation,
      },
      mcpSessions: {
        relation: Base.HasManyRelation,
        modelClass: McpSession,
        join: {
          from: 'mcp_servers.id',
          to: 'mcp_sessions.mcp_server_id',
        },
      },
      tools: {
        relation: Base.HasManyRelation,
        modelClass: McpTool,
        join: {
          from: 'mcp_servers.id',
          to: 'mcp_tools.mcp_server_id',
        },
      },
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'mcp_servers.user_id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  describe('generateToken', () => {
    it('should generate a UUID token', () => {
      const mcpServer = new McpServer();
      const testUuid = '550e8400-e29b-41d4-a716-446655440000';

      vi.spyOn(Crypto, 'randomUUID').mockReturnValue(testUuid);
      mcpServer.generateToken();

      expect(mcpServer.token).toBe(testUuid);
    });
  });

  describe('rotateToken', () => {
    it('should generate new token and update in database', async () => {
      const user = await createUser();

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      const newToken = '550e8400-e29b-41d4-a716-446655440001';
      vi.spyOn(Crypto, 'randomUUID').mockReturnValue(newToken);

      const updatedServer = await mcpServer.rotateToken();
      const refetchedServer = await McpServer.query().findById(mcpServer.id);

      expect(updatedServer.token).toBe(newToken);
      expect(refetchedServer.token).toBe(newToken);
    });
  });

  describe('serverUrl', () => {
    it('should return correct server URL with token', () => {
      const mcpServer = new McpServer();
      const testToken = '550e8400-e29b-41d4-a716-446655440003';
      mcpServer.token = testToken;

      const expectedUrl = `${appConfig.baseUrl}/api/v1/mcp/${testToken}`;
      expect(mcpServer.serverUrl).toBe(expectedUrl);
    });
  });

  describe('createTool', () => {
    it('should create new tool when none exists', async () => {
      const notifyToolsListChangedSpy = vi
        .spyOn(McpSession, 'notifyToolsListChanged')
        .mockResolvedValue();

      const user = await createUser();

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      const connection = await createConnection({
        userId: user.id,
      });

      const toolData = {
        connectionId: connection.id,
        appKey: 'slack',
        action: 'sendMessage',
      };

      const mcpTool = await mcpServer.createTool(toolData);

      expect(mcpTool.mcpServerId).toBe(mcpServer.id);
      expect(mcpTool.connectionId).toBe(connection.id);
      expect(mcpTool.appKey).toBe('slack');
      expect(mcpTool.action).toBe('sendMessage');
      expect(mcpTool.type).toBe('app');
      expect(mcpTool.flowId).toBeNull();
      expect(notifyToolsListChangedSpy).toHaveBeenCalledWith(mcpServer.id);
    });

    it('should create flow-type tool without connectionId', async () => {
      const notifyToolsListChangedSpy = vi
        .spyOn(McpSession, 'notifyToolsListChanged')
        .mockResolvedValue();

      const user = await createUser();

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      const flow = await createFlow({
        userId: user.id,
        name: 'Test Flow',
      });

      await createStep({
        type: 'trigger',
        flowId: flow.id,
        appKey: 'mcp',
        key: 'mcpTool',
        parameters: {
          toolName: 'test_flow_tool',
          toolDescription: 'A test flow tool',
        },
      });

      const toolData = {
        type: 'flow',
        flowId: flow.id,
      };

      const mcpTool = await mcpServer.createTool(toolData);

      expect(mcpTool.mcpServerId).toBe(mcpServer.id);
      expect(mcpTool.flowId).toBe(flow.id);
      expect(mcpTool.type).toBe('flow');
      expect(mcpTool.connectionId).toBeNull();
      expect(mcpTool.appKey).toBeNull();
      expect(mcpTool.action).toBe('test_flow_tool');
      expect(notifyToolsListChangedSpy).toHaveBeenCalledWith(mcpServer.id);
    });
  });

  describe('deleteTool', () => {
    it('should delete existing tool and notify sessions', async () => {
      const notifyToolsListChangedSpy = vi
        .spyOn(McpSession, 'notifyToolsListChanged')
        .mockResolvedValue();

      const user = await createUser();

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      const connection = await createConnection({
        userId: user.id,
      });

      const mcpTool = await createMcpTool({
        mcpServerId: mcpServer.id,
        connectionId: connection.id,
        appKey: 'slack',
        action: 'sendMessage',
      });

      const deletedTool = await mcpServer.deleteTool(mcpTool.id);

      expect(deletedTool.id).toBe(mcpTool.id);
      expect(notifyToolsListChangedSpy).toHaveBeenCalledWith(mcpServer.id);

      // Verify tool was deleted from database
      const refetchedTool = await McpTool.query().findById(mcpTool.id);
      expect(refetchedTool).toBeUndefined();
    });

    it('should throw error when tool not found', async () => {
      const user = await createUser();
      const nonExistentId = Crypto.randomUUID();

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      await expect(mcpServer.deleteTool(nonExistentId)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete all related tools before deleting server', async () => {
      const user = await createUser();

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      const connection = await createConnection({
        userId: user.id,
      });

      const tool1 = await createMcpTool({
        mcpServerId: mcpServer.id,
        connectionId: connection.id,
        appKey: 'slack',
        action: 'sendMessage',
      });

      const tool2 = await createMcpTool({
        mcpServerId: mcpServer.id,
        connectionId: connection.id,
        appKey: 'github',
        action: 'createIssue',
      });

      const deletedServer = await mcpServer.delete();

      expect(deletedServer.id).toBe(mcpServer.id);

      // Verify tools were deleted
      const deletedTool1 = await McpTool.query().findById(tool1.id);
      const deletedTool2 = await McpTool.query().findById(tool2.id);
      expect(deletedTool1).toBeUndefined();
      expect(deletedTool2).toBeUndefined();

      // Verify server was deleted
      const deletedServer2 = await McpServer.query().findById(mcpServer.id);
      expect(deletedServer2).toBeUndefined();
    });

    it('should delete server even when no tools exist', async () => {
      const user = await createUser();

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      const deletedServer = await mcpServer.delete();

      expect(deletedServer.id).toBe(mcpServer.id);

      // Verify server was deleted
      const refetchedServer = await McpServer.query().findById(mcpServer.id);
      expect(refetchedServer).toBeUndefined();
    });

    it('should call terminateSessions', async () => {
      const terminateSessionsSpy = vi
        .spyOn(McpServer.prototype, 'terminateSessions')
        .mockResolvedValue();

      const user = await createUser();

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      await mcpServer.delete();

      expect(terminateSessionsSpy).toHaveBeenCalled();
    });

    it('should delete all related sessions before deleting server', async () => {
      const user = await createUser();

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      const session1 = await createMcpSession({
        mcpServerId: mcpServer.id,
      });

      const session2 = await createMcpSession({
        mcpServerId: mcpServer.id,
      });

      const session3 = await createMcpSession({
        mcpServerId: mcpServer.id,
      });

      const deletedServer = await mcpServer.delete();

      expect(deletedServer.id).toBe(mcpServer.id);

      const deletedSession1 = await McpSession.query().findById(session1.id);
      const deletedSession2 = await McpSession.query().findById(session2.id);
      const deletedSession3 = await McpSession.query().findById(session3.id);

      expect(deletedSession1).toBeUndefined();
      expect(deletedSession2).toBeUndefined();
      expect(deletedSession3).toBeUndefined();

      const refetchedServer = await McpServer.query().findById(mcpServer.id);
      expect(refetchedServer).toBeUndefined();
    });
  });

  describe('notifyToolsListChanged', () => {
    it('should call mcp session with server id', async () => {
      const notifyToolsListChangedSpy = vi
        .spyOn(McpSession, 'notifyToolsListChanged')
        .mockResolvedValue();

      const user = await createUser();
      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      await mcpServer.notifyToolsListChanged();

      expect(notifyToolsListChangedSpy).toHaveBeenCalledWith(mcpServer.id);
    });
  });

  describe('$beforeInsert', () => {
    it('should generate token before inserting', async () => {
      const user = await createUser();
      const testUuid = '550e8400-e29b-41d4-a716-446655440002';

      vi.spyOn(Crypto, 'randomUUID').mockReturnValue(testUuid);

      const mcpServer = await McpServer.query().insertAndFetch({
        userId: user.id,
        name: 'Test Server',
      });

      expect(mcpServer.token).toBe(testUuid);
    });
  });

  describe('createTool', () => {
    it('should throw error when creating duplicate app tool', async () => {
      const user = await createUser();
      const connection = await createConnection({
        userId: user.id,
        key: 'slack',
      });

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      // Create first tool
      await mcpServer.createTool({
        type: 'app',
        appKey: 'slack',
        action: 'sendMessage',
        connectionId: connection.id,
      });

      // Try to create duplicate tool
      await expect(
        mcpServer.createTool({
          type: 'app',
          appKey: 'slack',
          action: 'sendMessage',
          connectionId: connection.id,
        })
      ).rejects.toThrow('Tool with the same app and action already exists');
    });

    it('should throw error when creating duplicate flow tool', async () => {
      const user = await createUser();
      const flow = await createFlow({ userId: user.id });

      // Create trigger step for the flow
      await createStep({
        flowId: flow.id,
        type: 'trigger',
        appKey: 'mcp',
        key: 'mcpTool',
        parameters: {
          toolName: 'test_flow_tool',
          toolDescription: 'Test flow tool',
        },
      });

      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      // Create first flow tool
      await mcpServer.createTool({
        type: 'flow',
        flowId: flow.id,
      });

      // Try to create duplicate flow tool
      await expect(
        mcpServer.createTool({
          type: 'flow',
          flowId: flow.id,
        })
      ).rejects.toThrow('Flow tool with the same flow already exists');
    });
  });
});
