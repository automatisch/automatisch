import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  arguments: [
    {
      description: 'The unique ID of your agent. If not specified, the first RCS-capable sender will be used.',
      key: 'from',
      label: 'From',
      required: false,
      type: 'string',
      variables: true,
    },
    {
      description: 'The recipient number for your RCS message. This can also be a contact name or a group name.',
      key: 'to',
      label: 'To',
      required: true,
      type: 'string',
      variables: true,
    },
    {
      description: 'Content of the RCS message. Plain text or an RCS object.',
      key: 'text',
      label: 'Message',
      required: true,
      type: 'string',
      variables: true,
    },
  ],
  description: 'Dispatch a rich communication message',
  key: 'sendRcs',
  name: 'Send RCS',

  async run($) {
    const {from, text, to} = $.step.parameters
    const params= {
      from: from.length ? from : null,
      text,
      to,
    }
    const response = await $.http.post('/rcs/messages', params);

    $.setActionItem({ raw: response.data });
  },
});
