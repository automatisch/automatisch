import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Send to trash',
  key: 'sendToTrash',
  description: 'Send an existing email message to the trash.',
  arguments: [
    {
      label: 'Message ID',
      key: 'messageId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listMessages',
          },
        ],
      },
    },
  ],

  async run($) {
    const { messageId } = $.step.parameters;
    const userId = $.auth.data.userId;

    const { data } = await $.http.post(
      `/gmail/v1/users/${userId}/messages/${messageId}/trash`
    );

    $.setActionItem({
      raw: data,
    });
  },
});
