import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Find ticket',
  key: 'findTicket',
  description: 'Finds an existing ticket.',
  arguments: [
    {
      label: 'Query',
      key: 'query',
      type: 'string' as const,
      required: true,
      variables: true,
      description:
        'Write a search string that specifies the way we will search for the ticket in Zendesk.',
    },
  ],

  async run($) {
    const query = $.step.parameters.query;

    const params = {
      query: `type:ticket ${query}`,
      sort_by: 'created_at',
      sort_order: 'desc',
    };

    const response = await $.http.get('/api/v2/search', { params });

    $.setActionItem({ raw: response.data.results[0] });
  },
});
