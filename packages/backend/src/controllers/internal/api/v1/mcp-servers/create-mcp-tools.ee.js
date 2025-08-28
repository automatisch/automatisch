import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const { mcpServerId } = request.params;
  const { connectionId, appKey, actions, type, flowId } = request.body;

  const mcpServer = await request.currentUser
    .$relatedQuery('mcpServers')
    .findOne({
      id: mcpServerId,
    })
    .throwIfNotFound();

  const mcpTool = await mcpServer.createOrUpdateTool({
    connectionId,
    appKey,
    actions,
    type,
    flowId,
  });

  renderObject(response, mcpTool, { status: 201 });
};
