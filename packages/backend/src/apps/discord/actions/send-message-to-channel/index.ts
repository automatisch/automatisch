import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Send a message to channel',
  key: 'sendMessageToChannel',
  description: 'Sends a message to a specific channel you specify.',
  arguments: [
    {
      label: 'Channel',
      key: 'channel',
      type: 'dropdown' as const,
      required: true,
      description: 'Pick a channel to send the message to.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
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
    },
  ],

  async run($) {
    const data = {
      content: $.step.parameters.message as string,
    };
    const response = await $.http?.post(
      `/channels/${$.step.parameters.channel}/messages`,
      data
    );

    $.setActionItem({ raw: response.data });
  },
});
