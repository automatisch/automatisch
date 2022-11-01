import defineAction from '../../../../helpers/define-action';
import postMessage from './post-message';

export default defineAction({
  name: 'Send a message to channel',
  key: 'sendMessageToChannel',
  description: 'Sends a message to a channel you specify.',
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
    },
  ],

  async run($) {
    const channelId = $.step.parameters.channel as string;
    const text = $.step.parameters.message as string;

    const message = await postMessage($, channelId, text);

    return message;
  },
});
