import { describe, it, expect } from 'vitest';
import Agent from '@/models/agent.ee.js';
import AgentTool from '@/models/agent-tool.ee.js';
import AgentExecution from '@/models/agent-execution.ee.js';
import Base from '@/models/base.js';
import User from '@/models/user.js';

describe('Agent model', () => {
  it('tableName should return correct name', () => {
    expect(Agent.tableName).toBe('agents');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Agent.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = Agent.relationMappings();

    const expectedRelations = {
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
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});
