import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find user by email',
  key: 'findUserByEmail',
  description: 'Finds a user by email.',
  arguments: [
    {
      label: 'Email',
      key: 'email',
      type: 'string',
      required: true,
      variables: true,
    },
  ],

  async run($) {
    const params = {
      email: $.step.parameters.email,
    };

    const { data } = await $.http.get('/users.lookupByEmail', {
      params,
    });

    if (data.ok) {
      $.setActionItem({ raw: data.user });
    }
  },
});
