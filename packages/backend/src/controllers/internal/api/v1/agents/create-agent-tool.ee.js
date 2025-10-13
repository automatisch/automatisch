import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const { agentId } = request.params;
  const { connectionId, appKey, actions, type, flowId } = request.body;

  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findOne({
      id: agentId,
    })
    .throwIfNotFound();

  const agentTool = await agent.createOrUpdateTool({
    connectionId,
    appKey,
    actions,
    type,
    flowId,
  });

  renderObject(response, agentTool, { status: 201 });
};
