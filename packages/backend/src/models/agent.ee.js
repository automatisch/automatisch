import Base from '@/models/base.js';
import User from '@/models/user.js';
import AgentTool from '@/models/agent-tool.ee.js';
import AgentExecution from '@/models/agent-execution.ee.js';

class Agent extends Base {
  static tableName = 'agents';

  static jsonSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      description: { type: 'string' },
      instructions: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    agentTools: {
      relation: Base.HasManyRelation,
      modelClass: AgentTool,
      join: {
        from: 'agents.id',
        to: 'agent_tools.agent_id',
      },
    },
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'users.id',
        to: 'agents.user_id',
      },
    },
    agentExecutions: {
      relation: Base.HasManyRelation,
      modelClass: AgentExecution,
      join: {
        from: 'agents.id',
        to: 'agent_executions.agent_id',
      },
    },
  });

  async createOrUpdateTool({
    connectionId,
    appKey,
    actions,
    type = 'app',
    flowId,
  }) {
    if (type === 'flow' && flowId) return;

    if (type === 'app' && appKey) {
      await this.$relatedQuery('agentTools').where('app_key', appKey).delete();

      const toolData = {
        agentId: this.id,
        type,
        connectionId,
        appKey,
        actions,
        flowId,
      };

      const tool = await this.$relatedQuery('agentTools').insert(toolData);

      return tool;
    }
  }
}

export default Agent;
