import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Send an SMS',
  key: 'sendSms',
  description: 'Sends an SMS',
  arguments: [
    {
      label: 'From Number',
      key: 'fromNumber',
      type: 'string' as const,
      required: true,
      description:
        'The number to send the SMS from. Include only country code. Example: 491234567890',
      variables: true,
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
    const messageBody = $.step.parameters.message;

    const fromNumber = '%2B' + ($.step.parameters.fromNumber as string).trim();
    const toNumber = '%2B' + ($.step.parameters.toNumber as string).trim();

    const response = await $.http.post(
      'https://' + $.auth.data.spaceName + '.' + $.auth.data.spaceRegion + 'signalwire.com' + requestPath,
      `Body=${messageBody}&From=${fromNumber}&To=${toNumber}`
    );

    $.setActionItem({ raw: response.data });
  },
});
