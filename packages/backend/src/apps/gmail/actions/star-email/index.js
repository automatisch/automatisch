import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Star an email',
  key: 'starEmail',
  description: 'Star an email message.',
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

    const body = {
      addLabelIds: ['STARRED'],
    };

    const { data } = await $.http.post(
      `/gmail/v1/users/${userId}/messages/${messageId}/modify`,
      body
    );

    $.setActionItem({
      raw: data,
    });
  },
});
