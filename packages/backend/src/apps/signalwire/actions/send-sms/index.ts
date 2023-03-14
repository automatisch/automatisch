import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Send an SMS',
  key: 'sendSms',
  description: 'Sends an SMS',
  arguments: [
    {
      label: 'From Number',
      key: 'fromNumber',
      type: 'dropdown' as const,
      required: true,
      description:
        'The number to send the SMS from. Include only country code. Example: 491234567890',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listIncomingPhoneNumbers',
          },
        ],
      },
    },
    {
      label: 'To Number',
      key: 'toNumber',
      type: 'string' as const,
      required: true,
      description:
        'The number to send the SMS to. Include only country code. Example: 491234567890',
      variables: true,
    },
    {
      label: 'Message',
      key: 'message',
      type: 'string' as const,
      required: true,
      description: 'The content of the message.',
      variables: true,
    },
  ],

  async run($) {
    const requestPath = `/api/laml/2010-04-01/Accounts/${$.auth.data.accountSid}/Messages`;

    const Body = $.step.parameters.message;
    const From = $.step.parameters.fromNumber;
    const To = '+' + ($.step.parameters.toNumber as string).trim();

    const response = await $.http.post(requestPath, null, {
      params: {
        Body,
        From,
        To,
      }
    });

    $.setActionItem({ raw: response.data });
  },
});
