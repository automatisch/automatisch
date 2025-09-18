import { describe, it, expect, beforeEach } from 'vitest';
import { createMcpServer } from '@/factories/mcp-server.js';
import mcpServerSerializer from '@/serializers/mcp-server.ee.js';

describe('mcpServerSerializer', () => {
  let mcpServer;

  beforeEach(async () => {
    mcpServer = await createMcpServer({
      name: 'Test MCP Server',
    });
  });

  it('should return MCP server data', async () => {
    const expectedPayload = {
      id: mcpServer.id,
      name: mcpServer.name,
      token: mcpServer.token,
      serverUrl: mcpServer.serverUrl,
      createdAt: mcpServer.createdAt.getTime(),
      updatedAt: mcpServer.updatedAt.getTime(),
    };

    expect(mcpServerSerializer(mcpServer)).toStrictEqual(expectedPayload);
  });
});
