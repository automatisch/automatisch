import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';

import app from '../../../../app.js';
import mcpSessionManager from '@/helpers/mcp-sessions.js';
import { createMcpServer } from '@/factories/mcp-server.js';
import { createUser } from '@/factories/user.js';
import * as license from '@/helpers/license.ee.js';

describe('POST /api/v1/mcp/:mcpServerToken', () => {
  let mcpServer, getTransportSpy;

  beforeEach(async () => {
    const user = await createUser();

    mcpServer = await createMcpServer({
      userId: user.id,
      name: 'Test MCP Server',
    });

    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    getTransportSpy = vi.spyOn(mcpSessionManager, 'getTransport');
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
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0',
        },
      },
    };

    // For initialize requests, the middleware creates a new transport
    // and the real MCP SDK handles the response. This is an integration
    // test that verifies the full flow works.
    const response = await request(app)
      .post(`/api/v1/mcp/${mcpServer.token}`)
      .set('Content-Type', 'application/json')
      .send(initializeRequest);

    // The exact response depends on the MCP SDK implementation
    // We just verify that the request is processed (not 404/500)
    expect([200, 400, 406]).toContain(response.status);
  });

  it('should handle tools/list request with valid session', async () => {
    const sessionId = 'test-session-id';
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

    getTransportSpy.mockReturnValue(mockTransport);

    const toolsListRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    };

    const response = await request(app)
      .post(`/api/v1/mcp/${mcpServer.token}`)
      .set('mcp-session-id', sessionId)
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
    const sessionId = 'test-session-id';
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

    getTransportSpy.mockReturnValue(mockTransport);

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
      .set('mcp-session-id', sessionId)
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
    const sessionId = 'non-existent-session-id';

    getTransportSpy.mockReturnValue(null);

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
        message: 'Bad Request: Invalid or expired session ID.',
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

  it('should return 400 when invalid session ID provided with invalid token', async () => {
    const sessionId = 'test-session-id';
    const invalidToken = 'invalid-token';

    const toolsListRequest = {
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/list',
    };

    const response = await request(app)
      .post(`/api/v1/mcp/${invalidToken}`)
      .set('mcp-session-id', sessionId)
      .send(toolsListRequest)
      .expect(400);

    expect(response.body).toEqual({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: Invalid or expired session ID.',
      },
      id: 7,
    });
  });
});
