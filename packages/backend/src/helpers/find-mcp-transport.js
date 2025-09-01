import Crypto from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import mcpSessionManager from '@/helpers/mcp-sessions.js';
import { createMcpServer } from '@/helpers/mcp.js';
import McpServer from '@/models/mcp-server.ee.js';

export default async function findMcpTransport(request, response, next) {
  const sessionId = request.headers['mcp-session-id'];
  const isInitRequest = request.body?.method === 'initialize';
  const { mcpServerToken } = request.params;

  if (isInitRequest) {
    // Create new transport for initialize request
    const mcpServer = await McpServer.query()
      .findOne({ token: mcpServerToken })
      .throwIfNotFound();

    const transport = new StreamableHTTPServerTransport({});

    const newSessionId = Crypto.randomUUID();
    transport.sessionId = newSessionId;

    response.setHeader('Mcp-Session-Id', newSessionId);

    const server = await createMcpServer(mcpServer.id);
    mcpSessionManager.add(newSessionId, mcpServer.id, transport, server);

    server.onclose = async () => {
      mcpSessionManager.remove(newSessionId);
    };

    await server.connect(transport);

    request.transport = transport;
  } else if (sessionId) {
    // Use existing transport for non-initialize requests
    const transport = mcpSessionManager.getTransport(sessionId);

    if (!transport) {
      return response.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: Invalid or expired session ID.',
        },
        id: request.body?.id,
      });
    }

    request.transport = transport;
    request.mcpSessionId = sessionId;
  } else {
    // No session ID for non-initialize request
    return response.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message:
          'Bad Request: No session ID provided for non-initialize request.',
      },
      id: request.body?.id,
    });
  }

  next();
}
