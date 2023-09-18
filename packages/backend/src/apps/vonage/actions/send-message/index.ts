import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Send Message',
  key: 'sendMessage',
  description: 'Send a message to a number.',
  arguments: [
    {
      label: 'Message Type',
      key: 'messageType',
      type: 'string' as const,
      required: true,
      description: 'The type of message to send. e.g. text',
      variables: true,
    },
    {
      label: 'Channel',
      key: 'channel',
      type: 'string' as const,
      required: true,
      description:
        'The channel to send the message through. e.g. sms, whatsapp',
      variables: true,
    },
    {
      label: 'From Number',
      key: 'fromNumber',
      type: 'string' as const,
      required: true,
      description:
        'The number to send the message from. Include country code. Example: 15551234567',
      variables: true,
    },
    {
      label: 'To Number',
      key: 'toNumber',
      type: 'string' as const,
      required: true,
      description:
        'The number to send the message to. Include country code. Example: 15551234567',
      variables: true,
    },
    {
      label: 'Message',
      key: 'message',
      type: 'string' as const,
      required: true,
      description: 'The message to send.',
      variables: true,
    },
  ],

  async run($) {
    const messageType = $.step.parameters.messageType as string;
    const channel = $.step.parameters.channel as string;
    const messageBody = $.step.parameters.message as string;
    const fromNumber = ($.step.parameters.fromNumber as string).trim();
    const toNumber = ($.step.parameters.toNumber as string).trim();

    const basicAuthToken = Buffer.from(
      `${$.auth.data.apiKey}:${$.auth.data.apiSecret}`
    ).toString('base64');

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${basicAuthToken}`,
    };

    const payload = {
      message_type: messageType,
      text: messageBody,
      to: toNumber,
      from: fromNumber,
      channel,
    };

    const response = await $.http.post('/messages', payload, { headers });

    $.setActionItem({ raw: response.data });
  },
});
