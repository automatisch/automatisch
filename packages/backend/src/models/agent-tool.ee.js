import Base from '@/models/base.js';
import Agent from '@/models/agent.ee.js';

class AgentTool extends Base {
  static tableName = 'agent_tools';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      agentId: { type: 'string', format: 'uuid' },
      type: {
        type: 'string',
        enum: ['flow', 'app'],
        default: 'app',
      },
      flowId: { type: 'string', format: 'uuid' },
      connectionId: { type: 'string', format: 'uuid' },
      appKey: { type: 'string' },
      actions: { type: 'array' },
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
        to: 'agent_tools.agent_id',
      },
    },
  });
}

export default AgentTool;
