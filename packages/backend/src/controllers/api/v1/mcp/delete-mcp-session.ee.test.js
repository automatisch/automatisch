import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';

import app from '../../../../app.js';
import McpSession from '@/models/mcp-session.ee.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import { createMcpSession } from '@/factories/mcp-session.js';
import { createUser } from '@/factories/user.js';
import * as license from '@/helpers/license.ee.js';

describe('DELETE /api/v1/mcp/:mcpServerToken', () => {
  let mcpServer, removeRuntimeSpy;

  beforeEach(async () => {
    const user = await createUser();

    mcpServer = await createMcpServer({
      userId: user.id,
      name: 'Test MCP Server',
    });

    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    removeRuntimeSpy = vi.spyOn(McpSession, 'removeRuntime');
  });

  it('should delete MCP session successfully when session exists', async () => {
    const session = await createMcpSession({
      mcpServerId: mcpServer.id,
    });

    const mockTransport = {
      handleDeleteRequest: vi.fn().mockResolvedValue(undefined),
    };

    McpSession.setRuntime(session.id, {
      transport: mockTransport,
      server: { close: vi.fn() },
      serverId: mcpServer.id,
    });

    await request(app)
      .delete(`/api/v1/mcp/${mcpServer.token}`)
      .set('mcp-session-id', session.id)
      .expect(204);

    expect(mockTransport.handleDeleteRequest).toHaveBeenCalledTimes(1);
    expect(removeRuntimeSpy).toHaveBeenCalledWith(session.id);
  });

  it('should return 400 when session not found', async () => {
    const sessionId = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID but non-existent

    const response = await request(app)
      .delete(`/api/v1/mcp/${mcpServer.token}`)
      .set('mcp-session-id', sessionId)
      .expect(400);

    expect(response.body).toEqual({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: Invalid session ID.',
      },
      id: undefined,
    });
    expect(removeRuntimeSpy).not.toHaveBeenCalled();
  });

  it('should return 400 when no session ID provided', async () => {
    const response = await request(app)
      .delete(`/api/v1/mcp/${mcpServer.token}`)
      .expect(400);

    expect(response.body).toEqual({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message:
          'Bad Request: No session ID provided for non-initialize request.',
      },
      id: undefined,
    });
    expect(removeRuntimeSpy).not.toHaveBeenCalled();
  });

  it('should return 404 when invalid token provided', async () => {
    const sessionId = '550e8400-e29b-41d4-a716-446655440000';
    const invalidToken = 'invalid-token-uuid';

    await request(app)
      .delete(`/api/v1/mcp/${invalidToken}`)
      .set('mcp-session-id', sessionId)
      .expect(404);

    expect(removeRuntimeSpy).not.toHaveBeenCalled();
  });

  it('should handle transport.handleDeleteRequest error gracefully', async () => {
    const session = await createMcpSession({
      mcpServerId: mcpServer.id,
    });

    const mockTransport = {
      handleDeleteRequest: vi
        .fn()
        .mockRejectedValue(new Error('Transport error')),
    };

    McpSession.setRuntime(session.id, {
      transport: mockTransport,
      server: { close: vi.fn() },
      serverId: mcpServer.id,
    });

    await request(app)
      .delete(`/api/v1/mcp/${mcpServer.token}`)
      .set('mcp-session-id', session.id)
      .expect(500);

    expect(mockTransport.handleDeleteRequest).toHaveBeenCalledTimes(1);
    expect(removeRuntimeSpy).not.toHaveBeenCalled();
  });
});
