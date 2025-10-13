import { describe, it, expect } from 'vitest';

import Base from '@/models/base.js';
import Agent from '@/models/agent.ee.js';
import AgentTool from '@/models/agent-tool.ee.js';

describe('AgentTool model', () => {
  it('tableName should return correct name', () => {
    expect(AgentTool.tableName).toBe('agent_tools');
  });

  it('jsonSchema should have correct validations', () => {
    expect(AgentTool.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = AgentTool.relationMappings();

    const expectedRelations = {
      agent: {
        relation: Base.BelongsToOneRelation,
        modelClass: Agent,
        join: {
          from: 'agents.id',
          to: 'agent_tools.agent_id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });
});
