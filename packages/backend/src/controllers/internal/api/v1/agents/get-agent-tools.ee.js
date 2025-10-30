import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const { agentId } = request.params;

  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findOne({
      id: agentId,
    })
    .throwIfNotFound();

  const agentTools = await agent
    .$relatedQuery('agentTools')
    .orderBy('app_key', 'asc');

  renderObject(response, agentTools);
};
