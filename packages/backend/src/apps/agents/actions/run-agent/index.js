import defineAction from '../../../../helpers/define-action.js';
import runAgent from '@/helpers/agents.js';
import Agent from '@/models/agent.ee.js';

export default defineAction({
  name: 'Run Agent',
  key: 'runAgent',
  description:
    'Execute an existing agent with a custom prompt and return the result.',
  arguments: [
    {
      label: 'Agent',
      key: 'agentId',
      type: 'dropdown',
      required: true,
      description: 'Select the agent to execute',
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [{ name: 'key', value: 'listAgents' }],
      },
    },
    {
      label: 'Prompt',
      key: 'prompt',
      type: 'string',
      required: true,
      description: 'The prompt or question to send to the agent',
      variables: true,
    },
  ],

  async run($) {
    const agent = await Agent.query().findOne({
      id: $.step.parameters.agentId,
    });

    const agentResult = await runAgent(agent, {
      prompt: $.step.parameters.prompt,
    });

    $.setActionItem({
      raw: agentResult,
    });
  },
});
