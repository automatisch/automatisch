import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Get user',
  key: 'getUser',
  description: 'Get an X user profile with follower counts and verification.',
  arguments: [
    {
      label: 'User ID or username',
      key: 'id',
      type: 'string',
      required: true,
      variables: true,
      description: 'X username without @, or numeric user ID.',
    },
  ],

  async run($) {
    const { data } = await $.http.get(`/x/users/${$.step.parameters.id}`);

    $.setActionItem({
      raw: data,
    });
  },
});
