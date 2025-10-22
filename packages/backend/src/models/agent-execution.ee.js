import Base from '@/models/base.js';
import Agent from '@/models/agent.ee.js';

class AgentExecution extends Base {
  static tableName = 'agent_executions';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      agentId: { type: 'string', format: 'uuid' },
      prompt: { type: 'string' },
      output: { type: 'string' },
      status: { type: 'string' },
      finishedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    agent: {
      relation: Base.BelongsToOneRelation,
      modelClass: Agent,
      join: {
        from: 'agents.id',
        to: 'agent_executions.agent_id',
      },
    },
  });
}

export default AgentExecution;
