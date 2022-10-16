import defineAction from '../../../../helpers/define-action';
import postMessage from './post-message';

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
      key: 'setupAction',
      name: 'Set up action',
      arguments: [
        {
          label: 'Channel',
          key: 'channel',
          type: 'dropdown',
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
          type: 'string',
          required: true,
          description: 'The content of your new message.',
          variables: true,
        },
      ],
    },
    {
      key: 'testStep',
      name: 'Test action',
    },
  ],

  async run($) {
    const channelId = $.step.parameters.channel as string;
    const text = $.step.parameters.message as string;

    const message = await postMessage($, channelId, text);

    return message;
  },
});
