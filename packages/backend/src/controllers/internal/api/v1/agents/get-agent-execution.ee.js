import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const { agentId, executionId } = request.params;

  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findById(agentId)
    .throwIfNotFound();

  const agentExecution = await agent
    .$relatedQuery('agentExecutions')
    .findById(executionId)
    .throwIfNotFound();

  renderObject(response, agentExecution);
};
