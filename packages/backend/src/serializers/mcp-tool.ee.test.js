import { describe, it, expect, beforeEach } from 'vitest';
import { createMcpTool } from '@/factories/mcp-tool.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import { createConnection } from '@/factories/connection.js';
import mcpToolSerializer from '@/serializers/mcp-tool.ee.js';

describe('mcpToolSerializer', () => {
  let mcpTool, mcpServer, connection;

  beforeEach(async () => {
    mcpServer = await createMcpServer({
      name: 'Test MCP Server',
    });

    connection = await createConnection();

    mcpTool = await createMcpTool({
      mcpServerId: mcpServer.id,
      connectionId: connection.id,
      appKey: 'slack',
      action: 'sendMessageToChannel',
      type: 'app',
    });
  });

  it('should return MCP tool data', async () => {
    const expectedPayload = {
      id: mcpTool.id,
      mcpServerId: mcpTool.mcpServerId,
      type: mcpTool.type,
      flowId: mcpTool.flowId,
      connectionId: mcpTool.connectionId,
      appKey: mcpTool.appKey,
      action: mcpTool.action,
      createdAt: mcpTool.createdAt.getTime(),
      updatedAt: mcpTool.updatedAt.getTime(),
    };

    expect(mcpToolSerializer(mcpTool)).toStrictEqual(expectedPayload);
  });
});
