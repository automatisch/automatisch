import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Send message',
  key: 'sendMessage',
  description: 'Sends a message to a chat you specify.',
  arguments: [
    {
      label: 'Chat ID',
      key: 'chatId',
      type: 'string',
      required: true,
      description:
        'Unique identifier for the target chat or username of the target channel (in the format @channelusername).',
      variables: true,
    },
    {
      label: 'Message text',
      key: 'text',
      type: 'string',
      required: true,
      description: 'Text of the message to be sent, 1-4096 characters.',
      variables: true,
    },
    {
      label: 'Disable notification?',
      key: 'disableNotification',
      type: 'dropdown',
      required: false,
      value: false,
      description:
        'Sends the message silently. Users will receive a notification with no sound.',
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
    {
      label: 'Parse Mode',
      key: 'parseMode',
      type: 'dropdown',
      required: false,
      description: 'Formatting style for the message text.',
      variables: true,
      options: [
        { label: 'None', value: '' },
        { label: 'Markdown', value: 'Markdown' },
        { label: 'MarkdownV2', value: 'MarkdownV2' },
        { label: 'HTML', value: 'HTML' },
      ],
    },
  ],

  async run($) {
    const payload = {
      chat_id: $.step.parameters.chatId,
      text: $.step.parameters.text,
      disable_notification: $.step.parameters.disableNotification,
    };

    // Only add parse_mode if set
    if ($.step.parameters.parseMode) {
      payload.parse_mode = $.step.parameters.parseMode;
    }

    const response = await $.http.post('/sendMessage', payload);

    $.setActionItem({
      raw: response.data,
    });
  },
});
