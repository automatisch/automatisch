import { renderObject } from '@/helpers/renderer.js';
import paginateRest from '@/helpers/pagination.js';

export default async (request, response) => {
  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findOne({
      id: request.params.mcpServerId,
    })
    .throwIfNotFound();

  const mcpToolExecutionsQuery = mcpServer
    .$relatedQuery('mcpToolExecutions')
    .orderBy('created_at', 'desc');

  const mcpToolExecutions = await paginateRest(
    mcpToolExecutionsQuery,
    request.query.page
  );

  renderObject(response, mcpToolExecutions);
};
