import AgentTool from '@/models/agent-tool.ee.js';

export default async (request, response) => {
  const { agentId, toolId } = request.params;

  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findOne({
      id: agentId,
    })
    .throwIfNotFound();

  const agentTool = await AgentTool.query()
    .findOne({
      id: toolId,
      agent_id: agent.id,
    })
    .throwIfNotFound();

  await agentTool.$query().delete();

  response.status(204).end();
};
