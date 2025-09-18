import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const { mcpServerId } = request.params;

  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findOne({
      id: mcpServerId,
    })
    .throwIfNotFound();

  const mcpTools = await mcpServer
    .$relatedQuery('tools')
    .orderBy('app_key', 'asc');

  renderObject(response, mcpTools);
};
