import { faker } from '@faker-js/faker';
import AgentExecution from '@/models/agent-execution.ee.js';
import { createAgent } from '@/factories/agent.js';

export const createAgentExecution = async (params = {}) => {
  params.agentId = params.agentId || (await createAgent()).id;
  params.status = params.status || 'completed';
  params.output = params.output || faker.lorem.paragraph();

  const agentExecution = await AgentExecution.query().insertAndFetch(params);

  return agentExecution;
};
