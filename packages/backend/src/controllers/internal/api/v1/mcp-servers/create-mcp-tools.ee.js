import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const { mcpServerId } = request.params;
  const { connectionId, appKey, action, type, flowId } = request.body;

  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findOne({
      id: mcpServerId,
    })
    .throwIfNotFound();

  const mcpTool = await mcpServer.createTool({
    connectionId,
    appKey,
    action,
    type,
    flowId,
  });

  renderObject(response, mcpTool, { status: 201 });
};
