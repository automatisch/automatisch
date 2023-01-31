import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Find user by email',
  key: 'findUserByEmail',
  description: 'Finds a user by email.',
  arguments: [
    {
      label: 'Email',
      key: 'email',
      type: 'string' as const,
      required: true,
      variables: true,
    },
  ],

  async run($) {
    const params = {
      email: $.step.parameters.email as string,
    };

    const { data } = await $.http.get('/users.lookupByEmail', {
      params
    });

    if (data.ok) {
      $.setActionItem({ raw: data.user });
    }
  },
});
