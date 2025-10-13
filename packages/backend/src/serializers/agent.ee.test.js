import { describe, it, expect, beforeEach } from 'vitest';
import { createAgent } from '@/factories/agent.js';
import agentSerializer from '@/serializers/agent.ee.js';

describe('agentSerializer', () => {
  let agent;

  beforeEach(async () => {
    agent = await createAgent({
      name: 'Test Agent',
      description: 'Test Description',
      instructions: 'Test Instructions',
    });
  });

  it('should return agent data', async () => {
    const expectedPayload = {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      instructions: agent.instructions,
      createdAt: agent.createdAt.getTime(),
      updatedAt: agent.updatedAt.getTime(),
    };

    expect(agentSerializer(agent)).toStrictEqual(expectedPayload);
  });
});
