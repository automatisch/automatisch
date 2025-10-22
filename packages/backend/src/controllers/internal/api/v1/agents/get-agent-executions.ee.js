import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const { agentId } = request.params;

  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findById(agentId)
    .throwIfNotFound();

  const agentExecutions = await agent
    .$relatedQuery('agentExecutions')
    .orderBy('created_at', 'desc');

  renderObject(response, agentExecutions);
};
