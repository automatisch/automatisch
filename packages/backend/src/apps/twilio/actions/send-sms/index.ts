import { URLSearchParams } from 'node:url';
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
        'The number to send the SMS from. Include country code. Example: 15551234567',
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
        'The number to send the SMS to. Include country code. Example: 15551234567',
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
    const requestPath = `/2010-04-01/Accounts/${$.auth.data.accountSid}/Messages.json`;
    const messageBody = $.step.parameters.message as string;

    const fromNumber = ($.step.parameters.fromNumber as string).trim();
    const toNumber = ($.step.parameters.toNumber as string).trim();

    const payload = new URLSearchParams({
      Body: messageBody,
      From: fromNumber,
      To: toNumber,
    }).toString();

    const response = await $.http.post(
      requestPath,
      payload,
    );

    $.setActionItem({ raw: response.data });
  },
});
