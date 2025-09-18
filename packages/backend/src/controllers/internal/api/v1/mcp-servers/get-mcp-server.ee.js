import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findOne({
      id: request.params.mcpServerId,
    })
    .throwIfNotFound();

  renderObject(response, mcpServer);
};
