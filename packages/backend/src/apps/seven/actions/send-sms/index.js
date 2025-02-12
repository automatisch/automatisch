import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  arguments: [
    {
      description: 'The sender identifier to send the SMS from.',
      key: 'from',
      label: 'From',
      required: false,
      type: 'string',
      variables: true,
    },
    {
      description: 'The recipients to send the SMS to. Multiple recipients can be separated by commas.',
      key: 'to',
      label: 'To',
      required: true,
      type: 'string',
      variables: true,
    },
    {
      description: 'The message to send.',
      key: 'text',
      label: 'Message',
      required: true,
      type: 'string',
      variables: true,
    },
  ],
  description: 'Sends an SMS',
  key: 'sendSms',
  name: 'Send an SMS',

  async run($) {
    const {from, text, to}= $.step.parameters
    const params = {
      from,
      text,
      to,
    }
    const response = await $.http.post('/sms', params);

    $.setActionItem({ raw: response.data });
  },
});
