import { describe, it, expect } from 'vitest';

import Base from '@/models/base.js';
import Agent from '@/models/agent.ee.js';
import AgentExecution from '@/models/agent-execution.ee.js';

describe('AgentExecution model', () => {
  it('tableName should return correct name', () => {
    expect(AgentExecution.tableName).toBe('agent_executions');
  });

  it('jsonSchema should have correct validations', () => {
    expect(AgentExecution.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = AgentExecution.relationMappings();

    const expectedRelations = {
      agent: {
        relation: Base.BelongsToOneRelation,
        modelClass: Agent,
        join: {
          from: 'agents.id',
          to: 'agent_executions.agent_id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});
