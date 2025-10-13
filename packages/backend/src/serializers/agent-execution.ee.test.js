import { describe, it, expect, beforeEach } from 'vitest';
import { createAgent } from '@/factories/agent.js';
import { createAgentExecution } from '@/factories/agent-execution.js';
import agentExecutionSerializer from '@/serializers/agent-execution.ee.js';

describe('agentExecutionSerializer', () => {
  let agent, agentExecution;

  beforeEach(async () => {
    agent = await createAgent({
      name: 'Test Agent',
      description: 'Test Description',
      instructions: 'Test Instructions',
    });

    agentExecution = await createAgentExecution({
      agentId: agent.id,
      prompt: 'Test Prompt',
      output: 'Test Output',
      status: 'completed',
    });
  });

  it('should return agent execution data', async () => {
    const expectedPayload = {
      id: agentExecution.id,
      agentId: agentExecution.agentId,
      prompt: agentExecution.prompt,
      output: agentExecution.output,
      status: agentExecution.status,
      finishedAt: agentExecution.finishedAt?.getTime(),
      createdAt: agentExecution.createdAt.getTime(),
      updatedAt: agentExecution.updatedAt.getTime(),
    };

    expect(agentExecutionSerializer(agentExecution)).toStrictEqual(
      expectedPayload
    );
  });
});
