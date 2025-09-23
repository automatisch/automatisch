import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { createMcpServer } from '@/helpers/mcp.ee.js';
import McpServer from '@/models/mcp-server.ee.js';
import McpSession from '@/models/mcp-session.ee.js';
import logger from '@/helpers/logger.js';

export default async function findMcpTransport(request, response, next) {
  const sessionIdHeader = request.headers['mcp-session-id'];
  const isInitRequest = request.body?.method === 'initialize';
  const { mcpServerToken } = request.params;

  if (sessionIdHeader) {
    logger.info(
      `MCP request with existing session: ${sessionIdHeader}, method: ${request.body?.method}`
    );
  }

  const mcpServer = await McpServer.query()
    .findOne({ token: mcpServerToken })
    .throwIfNotFound();

  let sessionId;
  let transport;
  let server;

  if (isInitRequest) {
    const clientInfo = request.body?.params?.clientInfo;
    const clientId = clientInfo?.name || clientInfo?.id;

    logger.info(
      `MCP initialize request from client: ${
        clientId || 'unknown'
      } for server: ${mcpServer.id}`
    );

    const session = await McpSession.query().insertAndFetch({
      mcpServerId: mcpServer.id,
    });
    sessionId = session.id;
    response.setHeader('Mcp-Session-Id', sessionId);
    logger.info(
      `Created new MCP session: ${sessionId} for server: ${mcpServer.id}${
        clientId ? ` (client: ${clientId})` : ''
      }`
    );

    transport = new StreamableHTTPServerTransport({});
    transport.sessionId = sessionId;

    server = await createMcpServer(mcpServer.id);
    server.onclose = async () => {
      logger.info(`MCP session closed: ${sessionId}`);
      await McpSession.close(sessionId);
    };
    await server.connect(transport);

    McpSession.setRuntime(sessionId, {
      transport,
      server,
      serverId: mcpServer.id,
    });
  } else {
    if (!sessionIdHeader) {
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

    const session = await McpSession.query().findOne({
      id: sessionIdHeader,
      mcp_server_id: mcpServer.id,
    });
    if (!session) {
      return response.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: Invalid session ID.',
        },
        id: request.body?.id,
      });
    }
    sessionId = session.id;

    const runtime = McpSession.getRuntime(sessionId);
    if (runtime) {
      transport = runtime.transport;
      server = runtime.server;
    } else {
      transport = new StreamableHTTPServerTransport({});
      transport.sessionId = sessionId;

      server = await createMcpServer(mcpServer.id);
      server.onclose = async () => {
        logger.info(`MCP session closed: ${sessionId}`);
        await McpSession.close(sessionId);
      };
      await server.connect(transport);

      McpSession.setRuntime(sessionId, {
        transport,
        server,
        serverId: mcpServer.id,
      });
    }
  }

  request.transport = transport;
  request.mcpSessionId = sessionId;
  next();
}
