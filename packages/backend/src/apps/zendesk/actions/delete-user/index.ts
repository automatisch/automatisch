import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Delete user',
  key: 'deleteUser',
  description: 'Deletes an existing user.',
  arguments: [
    {
      label: 'User',
      key: 'userId',
      type: 'dropdown' as const,
      required: true,
      variables: true,
      description: 'Select the user you want to modify.',
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listUsers',
          },
          {
            name: 'parameters.showUserRole',
            value: 'true',
          },
          {
            name: 'parameters.includeAllUsers',
            value: 'true',
          },
        ],
      },
    },
  ],

  async run($) {
    const userId = $.step.parameters.userId;

    const response = await $.http.delete(`/api/v2/users/${userId}`);

    $.setActionItem({ raw: response.data });
  },
});
