import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New tickets',
  key: 'newTickets',
  pollInterval: 15,
  description: 'Triggers when a new ticket is created in a specific view.',
  arguments: [
    {
      label: 'View',
      key: 'viewId',
      type: 'dropdown' as const,
      required: true,
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listViews',
          },
        ],
      },
    },
  ],

  async run($) {
    const viewId = $.step.parameters.viewId;

    const params = {
      'page[size]': 100,
      'page[after]': undefined as unknown as string,
      sort_by: 'nice_id',
      sort_order: 'desc',
    };
    let hasMore;

    do {
      const response = await $.http.get(`/api/v2/views/${viewId}/tickets`, {
        params,
      });
      const allTickets = response?.data?.tickets;
      hasMore = response?.data?.meta?.has_more;
      params['page[after]'] = response.data.meta?.after_cursor;

      if (allTickets?.length) {
        for (const ticket of allTickets) {
          $.pushTriggerItem({
            raw: ticket,
            meta: {
              internalId: ticket.id.toString(),
            },
          });
        }
      }
    } while (hasMore);
  },
});
