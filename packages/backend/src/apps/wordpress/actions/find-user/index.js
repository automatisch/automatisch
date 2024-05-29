import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find user',
  key: 'findUser',
  description: 'Finds a user.',
  arguments: [
    {
      label: 'User ID',
      key: 'userId',
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
            value: 'listUsers',
          },
        ],
      },
    },
  ],

  async run($) {
    const userId = $.step.parameters.userId;

    const response = await $.http.get(`?rest_route=/wp/v2/users/${userId}`);

    $.setActionItem({ raw: response.data });
  },
});
