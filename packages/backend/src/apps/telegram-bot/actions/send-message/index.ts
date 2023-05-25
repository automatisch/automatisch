import qs from 'qs';
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Send message',
  key: 'sendMessage',
  description: 'Sends a message to a chat you specify.',
  arguments: [
    {
      label: 'Chat ID',
      key: 'chatId',
      type: 'string' as const,
      required: true,
      description: 'Unique identifier for the target chat or username of the target channel (in the format @channelusername).',
      variables: true,
    },
    {
      label: 'Message text',
      key: 'text',
      type: 'string' as const,
      required: true,
      description: 'Text of the message to be sent, 1-4096 characters.',
      variables: true,
    },
    {
      label: 'Disable notification?',
      key: 'disableNotification',
      type: 'dropdown' as const,
      required: false,
      value: false,
      description: 'Sends the message silently. Users will receive a notification with no sound.',
      variables: true,
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },
  ],

  async run($) {
    const payload = {
      chat_id: $.step.parameters.chatId,
      text: $.step.parameters.text,
      disable_notification: $.step.parameters.disableNotification,
    };

    const response = await $.http.post('/sendMessage', payload);

    $.setActionItem({
      raw: response.data,
    });
  },
});
