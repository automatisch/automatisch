import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New page',
  key: 'newPage',
  description: 'Triggers when a new page is created.',
  arguments: [
    {
      label: 'Status',
      key: 'status',
      type: 'dropdown' as const,
      required: true,
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listStatuses',
          },
        ],
      },
    },
  ],

  async run($) {
    const params = {
      per_page: 100,
      page: 1,
      order: 'desc',
      orderby: 'date',
      status: $.step.parameters.status || '',
    };

    let totalPages = 1;
    do {
      const { data, headers } = await $.http.get('?rest_route=/wp/v2/pages', {
        params,
      });

      params.page = params.page + 1;
      totalPages = Number(headers['x-wp-totalpages']);

      if (data.length) {
        for (const page of data) {
          const dataItem = {
            raw: page,
            meta: {
              internalId: page.id.toString(),
            },
          };

          $.pushTriggerItem(dataItem);
        }
      }
    } while (params.page <= totalPages);
  },
});
