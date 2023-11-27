import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Find user',
  key: 'findUser',
  description: 'Finds an existing user.',
  arguments: [
    {
      label: 'Query',
      key: 'query',
      type: 'string' as const,
      required: true,
      variables: true,
      description:
        'Write a search string that specifies the way we will search for the user in Zendesk.',
    },
  ],

  async run($) {
    const query = $.step.parameters.query;

    const params = {
      query,
    };

    const response = await $.http.get('/api/v2/users/search', { params });

    $.setActionItem({ raw: response.data.users[0] });
  },
});
