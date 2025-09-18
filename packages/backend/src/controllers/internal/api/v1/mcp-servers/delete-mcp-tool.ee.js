import McpServer from '@/models/mcp-server.ee.js';

export default async (request, response) => {
  const { mcpServerId, mcpToolId } = request.params;

  const mcpServer = await McpServer.query()
    .findById(mcpServerId)
    .throwIfNotFound();

  await mcpServer.deleteTool(mcpToolId);

  response.status(204).end();
};
