import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';

import app from '../../../../app.js';
import McpSession from '@/models/mcp-session.ee.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import { createMcpSession } from '@/factories/mcp-session.js';
import { createUser } from '@/factories/user.js';
import * as license from '@/helpers/license.ee.js';

describe('POST /api/v1/mcp/:mcpServerToken', () => {
  let mcpServer;

  beforeEach(async () => {
    const user = await createUser();

    mcpServer = await createMcpServer({
      userId: user.id,
      name: 'Test MCP Server',
    });

    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);
  });

  it('should handle initialize request successfully', async () => {
    // Note: Initialize requests create new transports via middleware
    // and involve complex MCP SDK interactions that are hard to test
    // in isolation. This test verifies the endpoint accepts initialize
    // requests and that the middleware/controller integration works.
    const initializeRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {
          tools: {},
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0',
        },
      },
    };

    const response = await request(app)
      .post(`/api/v1/mcp/${mcpServer.token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json, text/event-stream')
      .send(initializeRequest)
      .expect(200);

    expect(response.headers['mcp-session-id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it('should handle tools/list request with valid session', async () => {
    const session = await createMcpSession({
      mcpServerId: mcpServer.id,
    });

    const mockTransport = {
      handleRequest: vi.fn().mockImplementation(async (req, res, body) => {
        res.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            tools: [
              {
                name: 'test-tool',
                description: 'A test tool',
                inputSchema: {
                  type: 'object',
                  properties: {},
                },
              },
            ],
          },
        });
      }),
    };

    McpSession.setRuntime(session.id, {
      transport: mockTransport,
      server: null,
      serverId: mcpServer.id,
    });

    const toolsListRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    };

    const response = await request(app)
      .post(`/api/v1/mcp/${mcpServer.token}`)
      .set('mcp-session-id', session.id)
      .send(toolsListRequest)
      .expect(200);

    expect(mockTransport.handleRequest).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({
      jsonrpc: '2.0',
      id: 2,
      result: {
        tools: [
          {
            name: 'test-tool',
            description: 'A test tool',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      },
    });
  });

  it('should handle tools/call request with valid session', async () => {
    const session = await createMcpSession({
      mcpServerId: mcpServer.id,
    });

    const mockTransport = {
      handleRequest: vi.fn().mockImplementation(async (req, res, body) => {
        res.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            content: [
              {
                type: 'text',
                text: 'Tool executed successfully',
              },
            ],
          },
        });
      }),
    };

    McpSession.setRuntime(session.id, {
      transport: mockTransport,
      server: null,
      serverId: mcpServer.id,
    });

    const toolsCallRequest = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'test-tool',
        arguments: {
          input: 'test input',
        },
      },
    };

    const response = await request(app)
      .post(`/api/v1/mcp/${mcpServer.token}`)
      .set('mcp-session-id', session.id)
      .send(toolsCallRequest)
      .expect(200);

    expect(mockTransport.handleRequest).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({
      jsonrpc: '2.0',
      id: 3,
      result: {
        content: [
          {
            type: 'text',
            text: 'Tool executed successfully',
          },
        ],
      },
    });
  });

  it('should return 400 when session not found for non-initialize request', async () => {
    const sessionId = '550e8400-e29b-41d4-a716-446655440000';

    const toolsListRequest = {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/list',
    };

    const response = await request(app)
      .post(`/api/v1/mcp/${mcpServer.token}`)
      .set('mcp-session-id', sessionId)
      .send(toolsListRequest)
      .expect(400);

    expect(response.body).toEqual({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: Invalid session ID.',
      },
      id: 4,
    });
  });

  it('should return 400 when no session ID provided for non-initialize request', async () => {
    const toolsListRequest = {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/list',
    };

    const response = await request(app)
      .post(`/api/v1/mcp/${mcpServer.token}`)
      .send(toolsListRequest)
      .expect(400);

    expect(response.body).toEqual({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message:
          'Bad Request: No session ID provided for non-initialize request.',
      },
      id: 5,
    });
  });

  it('should return 404 when invalid token is provided', async () => {
    const sessionId = '550e8400-e29b-41d4-a716-446655440000';
    const invalidToken = '550e8400-e29b-41d4-a716-446655440001';

    const toolsListRequest = {
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/list',
    };

    await request(app)
      .post(`/api/v1/mcp/${invalidToken}`)
      .set('mcp-session-id', sessionId)
      .send(toolsListRequest)
      .expect(404);
  });
});
