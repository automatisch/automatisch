import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New post',
  key: 'newPost',
  description: 'Triggers when a new post is created.',
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
      const {
        data,
        headers
      } = await $.http.get('?rest_route=/wp/v2/posts', { params });

      params.page = params.page + 1;
      totalPages = Number(headers['x-wp-totalpages']);

      if (data.length) {
        for (const post of data) {
          const dataItem = {
            raw: post,
            meta: {
              internalId: post.id.toString(),
            },
          };

          $.pushTriggerItem(dataItem);
        }
      }
    } while (params.page <= totalPages);
  },
});
