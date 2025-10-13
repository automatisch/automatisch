import { renderObject } from '@/helpers/renderer.js';
import runAgent from '@/helpers/agents.js';

export default async (request, response) => {
  const { agentId } = request.params;
  const { messages } = request.body;

  // Validate messages array
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return response.status(400).json({
      error: 'Messages array is required and must not be empty',
    });
  }

  // Validate last message is from user
  const latestMessage = messages[messages.length - 1];
  if (latestMessage.role !== 'user') {
    return response.status(400).json({
      error: 'Last message must be from user',
    });
  }

  const agent = await request.currentUser
    .$relatedQuery('agents')
    .findOne({
      id: agentId,
    })
    .throwIfNotFound();

  try {
    // Use the refactored runAgent helper with messages
    const result = await runAgent(agent, { messages });

    const outputText = result.output?.[0]?.text || result.output;

    // Get the execution that was created by runAgent
    const execution = await agent
      .$relatedQuery('agentExecutions')
      .orderBy('created_at', 'desc')
      .first();

    // Return response
    renderObject(response, {
      response: outputText,
      executionId: execution?.id,
    });
  } catch (error) {
    console.error('Agent test execution error:', error);

    response.status(500).json({
      error: error.message || 'Agent execution failed',
    });
  }
};
