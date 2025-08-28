import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';

import app from '../../../../app.js';
import mcpSessionManager from '@/helpers/mcp-sessions.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import { createUser } from '@/factories/user.js';
import * as license from '@/helpers/license.ee.js';

describe('DELETE /api/v1/mcp/:mcpServerToken', () => {
  let mcpServer, getTransportSpy, removeSpy;

  beforeEach(async () => {
    const user = await createUser();

    mcpServer = await createMcpServer({
      userId: user.id,
      name: 'Test MCP Server',
    });

    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    getTransportSpy = vi.spyOn(mcpSessionManager, 'getTransport');
    removeSpy = vi.spyOn(mcpSessionManager, 'remove');
  });

  it('should delete MCP session successfully when transport exists', async () => {
    const sessionId = 'test-session-id';
    const mockTransport = {
      handleDeleteRequest: vi.fn().mockResolvedValue(undefined),
    };

    getTransportSpy.mockReturnValue(mockTransport);

    await request(app)
      .delete(`/api/v1/mcp/${mcpServer.token}`)
      .set('mcp-session-id', sessionId)
      .expect(204);

    expect(mockTransport.handleDeleteRequest).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith(sessionId);
  });

  it('should return 400 when session not found', async () => {
    const sessionId = 'non-existent-session-id';

    getTransportSpy.mockReturnValue(null);

    const response = await request(app)
      .delete(`/api/v1/mcp/${mcpServer.token}`)
      .set('mcp-session-id', sessionId)
      .expect(400);

    expect(response.body).toEqual({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: Invalid or expired session ID.',
      },
      id: undefined,
    });
    expect(removeSpy).not.toHaveBeenCalled();
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
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('should return 400 when invalid session ID provided with invalid token', async () => {
    const sessionId = 'test-session-id';
    const invalidToken = 'invalid-token';

    const response = await request(app)
      .delete(`/api/v1/mcp/${invalidToken}`)
      .set('mcp-session-id', sessionId)
      .expect(400);

    expect(response.body).toEqual({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: Invalid or expired session ID.',
      },
      id: undefined,
    });
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('should handle transport.handleDeleteRequest error gracefully', async () => {
    const sessionId = 'test-session-id';
    const mockTransport = {
      handleDeleteRequest: vi
        .fn()
        .mockRejectedValue(new Error('Transport error')),
    };

    getTransportSpy.mockReturnValue(mockTransport);

    await request(app)
      .delete(`/api/v1/mcp/${mcpServer.token}`)
      .set('mcp-session-id', sessionId)
      .expect(500);

    expect(mockTransport.handleDeleteRequest).toHaveBeenCalledTimes(1);
    // Session should not be removed if transport.handleDeleteRequest fails
    expect(removeSpy).not.toHaveBeenCalled();
  });
});
