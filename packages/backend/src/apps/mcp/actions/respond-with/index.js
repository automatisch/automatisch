import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Respond with',
  key: 'respondWith',
  description: 'Respond to MCP tool call with custom content.',
  arguments: [
    {
      label: 'Output',
      key: 'output',
      type: 'string',
      required: true,
      description: 'The content of the response output.',
      variables: true,
    },
  ],

  async run($) {
    const output = $.step.parameters.output;

    $.setActionItem({
      raw: {
        output,
      },
    });
  },
});
