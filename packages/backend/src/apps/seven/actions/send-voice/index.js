import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  arguments: [
    {
      description: 'The number to initiate the call from. Must be verified.',
      key: 'fromNumber',
      label: 'From',
      required: false,
      type: 'string',
      variables: true,
    },
    {
      description: 'The phone number for calling.',
      key: 'to',
      label: 'Callee',
      required: true,
      type: 'string',
      variables: true,
    },
    {
      description: 'The message to convert to speech.',
      key: 'text',
      label: 'Message',
      required: true,
      type: 'string',
      variables: true,
    },
  ],
  description: 'Makes a text-to-speech call',
  key: 'sendVoice',
  name: 'Make a text-to-speech call',

  async run($) {
    const {from, text, to} = $.step.parameters
    const params= {
      from,
      text,
      to,
    }
    const response = await $.http.post('/voice', params);

    $.setActionItem({ raw: response.data });
  },
});
