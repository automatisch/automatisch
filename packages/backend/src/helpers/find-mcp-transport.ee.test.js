import { describe, it, expect, beforeEach, vi } from 'vitest';

import findMcpTransport from '@/helpers/find-mcp-transport.ee.js';
import McpSession from '@/models/mcp-session.ee.js';
import * as mcpHelper from '@/helpers/mcp.ee.js';
import { createUser } from '@/factories/user.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import { createMcpSession } from '@/factories/mcp-session.js';

vi.mock('@modelcontextprotocol/sdk/server/streamableHttp.js', () => ({
  StreamableHTTPServerTransport: vi.fn().mockImplementation(() => ({})),
}));

describe('find-mcp-transport middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      headers: {},
      body: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      setHeader: vi.fn(),
    };
    next = vi.fn();
  });

  describe('initialize request', () => {
    it('should create new session and transport for initialize request', async () => {
      const user = await createUser();
      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      const mockServer = {
        connect: vi.fn(),
        onclose: null,
      };

      vi.spyOn(mcpHelper, 'createMcpServer').mockResolvedValue(mockServer);

      req.params.mcpServerToken = mcpServer.token;
      req.body = { method: 'initialize' };

      await findMcpTransport(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Mcp-Session-Id',
        expect.any(String)
      );
      expect(req.transport).toBeDefined();
      expect(req.mcpSessionId).toBeDefined();
      expect(next).toHaveBeenCalledOnce();
      expect(mockServer.connect).toHaveBeenCalled();
    });

    it('should handle initialize request without client ID', async () => {
      const user = await createUser();
      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      const mockServer = {
        connect: vi.fn(),
        onclose: null,
      };

      vi.spyOn(mcpHelper, 'createMcpServer').mockResolvedValue(mockServer);

      req.params.mcpServerToken = mcpServer.token;
      req.body = {
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
        },
      };

      await findMcpTransport(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Mcp-Session-Id',
        expect.any(String)
      );
      expect(req.transport).toBeDefined();
      expect(req.mcpSessionId).toBeDefined();
      expect(next).toHaveBeenCalledOnce();
      expect(mockServer.connect).toHaveBeenCalled();
    });
  });

  describe('non-initialize request', () => {
    it('should return error when session ID not provided', async () => {
      const user = await createUser();
      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      req.params.mcpServerToken = mcpServer.token;
      req.body = { method: 'tools/list', id: 1 };

      await findMcpTransport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message:
            'Bad Request: No session ID provided for non-initialize request.',
        },
        id: 1,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return error when session ID is invalid', async () => {
      const user = await createUser();
      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      req.params.mcpServerToken = mcpServer.token;
      req.headers['mcp-session-id'] = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID but non-existent session
      req.body = { method: 'tools/list', id: 2 };

      await findMcpTransport(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: Invalid session ID.',
        },
        id: 2,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should use existing session for valid session ID', async () => {
      const user = await createUser();
      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });
      const mcpSession = await createMcpSession({
        mcpServerId: mcpServer.id,
      });

      const mockServer = {
        connect: vi.fn(),
        onclose: null,
      };

      vi.spyOn(mcpHelper, 'createMcpServer').mockResolvedValue(mockServer);

      req.params.mcpServerToken = mcpServer.token;
      req.headers['mcp-session-id'] = mcpSession.id;
      req.body = { method: 'tools/list' };

      await findMcpTransport(req, res, next);

      expect(req.transport).toBeDefined();
      expect(req.mcpSessionId).toBe(mcpSession.id);
      expect(next).toHaveBeenCalledOnce();
      expect(mockServer.connect).toHaveBeenCalled();
    });
  });

  describe('server not found', () => {
    it('should throw error when server token is invalid', async () => {
      req.params.mcpServerToken = 'invalid-token';
      req.body = { method: 'initialize' };

      await expect(findMcpTransport(req, res, next)).rejects.toThrow();
    });
  });

  describe('onclose handler', () => {
    it('should setup onclose handler to clean up session', async () => {
      const user = await createUser();
      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });

      const mockServer = {
        connect: vi.fn(),
        onclose: null,
      };

      vi.spyOn(mcpHelper, 'createMcpServer').mockResolvedValue(mockServer);
      const closeSpy = vi.spyOn(McpSession, 'close');

      req.params.mcpServerToken = mcpServer.token;
      req.body = { method: 'initialize' };

      await findMcpTransport(req, res, next);

      expect(mockServer.onclose).toBeDefined();

      await mockServer.onclose();

      expect(closeSpy).toHaveBeenCalledWith(req.mcpSessionId);
    });

    it('should setup onclose handler for existing session without runtime', async () => {
      const user = await createUser();
      const mcpServer = await createMcpServer({
        userId: user.id,
        name: 'Test Server',
      });
      const mcpSession = await createMcpSession({
        mcpServerId: mcpServer.id,
      });

      // Ensure no runtime exists for this session
      vi.spyOn(McpSession, 'getRuntime').mockReturnValue(null);

      const mockServer = {
        connect: vi.fn(),
        onclose: null,
      };

      vi.spyOn(mcpHelper, 'createMcpServer').mockResolvedValue(mockServer);
      const closeSpy = vi.spyOn(McpSession, 'close');

      req.params.mcpServerToken = mcpServer.token;
      req.headers['mcp-session-id'] = mcpSession.id;
      req.body = { method: 'tools/list' };

      await findMcpTransport(req, res, next);

      expect(mockServer.onclose).toBeDefined();

      await mockServer.onclose();

      expect(closeSpy).toHaveBeenCalledWith(mcpSession.id);
    });
  });
});
