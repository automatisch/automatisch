import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Send a message to channel',
  key: 'sendMessageToChannel',
  description: 'Send a message to a specific channel you specify.',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'chooseAction',
      name: 'Set up action',
      arguments: [
        {
          label: 'Channel',
          key: 'channel',
          type: 'dropdown' as const,
          required: true,
          description: 'Pick a channel to send the message to.',
          variables: false,
          source: {
            type: 'query',
            name: 'getData',
            arguments: [
              {
                name: 'key',
                value: 'listChannels',
              },
            ],
          },
        },
        {
          label: 'Message text',
          key: 'message',
          type: 'string' as const,
          required: true,
          description: 'The content of your new message.',
          variables: true,
        }
      ],
    },
    {
      key: 'testStep',
      name: 'Test action',
    },
  ],

  async run($) {
    const data = {
      content: $.step.parameters.message as string,
    };
    const response = await $.http?.post(`/channels/${$.step.parameters.channel}/messages`, data);

    $.setActionItem({ raw: response.data });
  },
});
