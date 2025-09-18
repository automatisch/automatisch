import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const { mcpServerId } = request.params;

  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findOne({
      id: mcpServerId,
    })
    .throwIfNotFound();

  const updatedMcpServer = await mcpServer.rotateToken();

  renderObject(response, updatedMcpServer);
};
