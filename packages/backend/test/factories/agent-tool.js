import { faker } from '@faker-js/faker';

import { createAgent } from './agent.js';
import { createConnection } from './connection.js';
import AgentTool from '@/models/agent-tool.ee.js';

export const createAgentTool = async (params = {}) => {
  params.agentId = params.agentId || (await createAgent()).id;

  const agentToolData = {
    agentId: params.agentId,
    type: params.type || 'app',
    appKey: params.appKey || 'slack',
    actions: params.actions || ['sendMessage'],
  };

  if (agentToolData.type === 'app') {
    agentToolData.connectionId =
      params.connectionId || (await createConnection()).id;
  }

  if (params.type === 'flow' || params.flowId) {
    agentToolData.flowId = params.flowId || faker.string.uuid();
  }

  return await AgentTool.query().insertAndFetch(agentToolData);
};
