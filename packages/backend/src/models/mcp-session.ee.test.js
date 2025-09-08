import { describe, it, expect, beforeEach } from 'vitest';

import Base from '@/models/base.js';
import McpServer from '@/models/mcp-server.ee.js';
import McpSession from '@/models/mcp-session.ee.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import { createMcpSession } from '@/factories/mcp-session.js';
import { createUser } from '@/factories/user.js';

describe('McpSession model', () => {
  let mcpServer;

  beforeEach(async () => {
    const user = await createUser();
    mcpServer = await createMcpServer({
      userId: user.id,
      name: 'Test MCP Server',
    });
  });

  it('tableName should return correct name', () => {
    expect(McpSession.tableName).toBe('mcp_sessions');
  });

  it('jsonSchema should have correct validations', () => {
    expect(McpSession.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = McpSession.relationMappings();

    const expectedRelations = {
      mcpServer: {
        relation: Base.BelongsToOneRelation,
        modelClass: McpServer,
        join: {
          from: 'mcp_sessions.mcp_server_id',
          to: 'mcp_servers.id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  describe('runtime management', () => {
    it('should store and retrieve runtime data', () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const mockTransport = { type: 'transport' };
      const mockServer = { type: 'server' };

      McpSession.setRuntime(sessionId, {
        transport: mockTransport,
        server: mockServer,
        serverId: mcpServer.id,
      });

      const runtime = McpSession.getRuntime(sessionId);
      expect(runtime).toBeDefined();
      expect(runtime.transport).toBe(mockTransport);
      expect(runtime.server).toBe(mockServer);
      expect(runtime.serverId).toBe(mcpServer.id);

      const transport = McpSession.getTransport(sessionId);
      expect(transport).toBe(mockTransport);

      const server = McpSession.getServer(sessionId);
      expect(server).toBe(mockServer);

      McpSession.removeRuntime(sessionId);
      expect(McpSession.getRuntime(sessionId)).toBeUndefined();
      expect(McpSession.getTransport(sessionId)).toBeUndefined();
      expect(McpSession.getServer(sessionId)).toBeUndefined();
    });
  });

  describe('close', () => {
    it('should delete the session from database', async () => {
      const session = await createMcpSession({
        mcpServerId: mcpServer.id,
      });

      await McpSession.close(session.id);

      const foundSession = await McpSession.query().findById(session.id);
      expect(foundSession).toBeUndefined();
    });

    it('should remove runtime data when closing', async () => {
      const session = await createMcpSession({
        mcpServerId: mcpServer.id,
      });

      const mockTransport = { test: 'transport' };
      const mockServer = { test: 'server' };

      McpSession.setRuntime(session.id, {
        transport: mockTransport,
        server: mockServer,
        serverId: mcpServer.id,
      });

      expect(McpSession.getRuntime(session.id)).toBeDefined();

      await McpSession.close(session.id);

      expect(McpSession.getRuntime(session.id)).toBeUndefined();

      const foundSession = await McpSession.query().findById(session.id);
      expect(foundSession).toBeUndefined();
    });
  });

  describe('terminateServerSessions', () => {
    it('should close all sessions for a specific server', async () => {
      const session1Id = '550e8400-e29b-41d4-a716-446655440001';
      const session2Id = '550e8400-e29b-41d4-a716-446655440002';
      const otherSessionId = '550e8400-e29b-41d4-a716-446655440003';

      const mockServer1 = { close: async () => {} };
      const mockServer2 = { close: async () => {} };
      const mockServer3 = { close: async () => {} };

      McpSession.setRuntime(session1Id, {
        transport: null,
        server: mockServer1,
        serverId: mcpServer.id,
      });

      McpSession.setRuntime(session2Id, {
        transport: null,
        server: mockServer2,
        serverId: mcpServer.id,
      });

      McpSession.setRuntime(otherSessionId, {
        transport: null,
        server: mockServer3,
        serverId: 'other-server-id',
      });

      await McpSession.terminateServerSessions(mcpServer.id);

      expect(McpSession.getRuntime(session1Id)).toBeUndefined();
      expect(McpSession.getRuntime(session2Id)).toBeUndefined();
      expect(McpSession.getRuntime(otherSessionId)).toBeDefined();

      // Clean up
      McpSession.removeRuntime(otherSessionId);
    });

    it('should handle errors gracefully when closing servers', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440001';
      const mockServer = {
        close: async () => {
          throw new Error('Close failed');
        },
      };

      McpSession.setRuntime(sessionId, {
        transport: null,
        server: mockServer,
        serverId: mcpServer.id,
      });

      // Should not throw
      await expect(
        McpSession.terminateServerSessions(mcpServer.id)
      ).resolves.toBeUndefined();

      expect(McpSession.getRuntime(sessionId)).toBeUndefined();
    });
  });

  describe('notifyToolsListChanged', () => {
    it('should send notification to all sessions of a server', async () => {
      const session1Id = '550e8400-e29b-41d4-a716-446655440001';
      const session2Id = '550e8400-e29b-41d4-a716-446655440002';

      let notificationsSent = 0;
      const mockServer = {
        sendToolListChanged: async () => {
          notificationsSent++;
        },
      };

      McpSession.setRuntime(session1Id, {
        transport: null,
        server: mockServer,
        serverId: mcpServer.id,
      });

      McpSession.setRuntime(session2Id, {
        transport: null,
        server: mockServer,
        serverId: mcpServer.id,
      });

      await McpSession.notifyToolsListChanged(mcpServer.id);

      expect(notificationsSent).toBe(2);

      // Clean up
      McpSession.removeRuntime(session1Id);
      McpSession.removeRuntime(session2Id);
    });

    it('should handle notification errors gracefully', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440001';
      const mockServer = {
        sendToolListChanged: async () => {
          throw new Error('Notification failed');
        },
      };

      McpSession.setRuntime(sessionId, {
        transport: null,
        server: mockServer,
        serverId: mcpServer.id,
      });

      // Should not throw
      await expect(
        McpSession.notifyToolsListChanged(mcpServer.id)
      ).resolves.toBeUndefined();

      // Session should still exist
      expect(McpSession.getRuntime(sessionId)).toBeDefined();

      // Clean up
      McpSession.removeRuntime(sessionId);
    });

    it('should only notify sessions with servers', async () => {
      const sessionWithServerId = '550e8400-e29b-41d4-a716-446655440001';
      const sessionWithoutServerId = '550e8400-e29b-41d4-a716-446655440002';

      let notificationsSent = 0;
      const mockServer = {
        sendToolListChanged: async () => {
          notificationsSent++;
        },
      };

      McpSession.setRuntime(sessionWithServerId, {
        transport: null,
        server: mockServer,
        serverId: mcpServer.id,
      });

      McpSession.setRuntime(sessionWithoutServerId, {
        transport: null,
        server: null, // No server
        serverId: mcpServer.id,
      });

      await McpSession.notifyToolsListChanged(mcpServer.id);

      expect(notificationsSent).toBe(1);

      // Clean up
      McpSession.removeRuntime(sessionWithServerId);
      McpSession.removeRuntime(sessionWithoutServerId);
    });
  });
});
