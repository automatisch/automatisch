export default {
  name: 'List tags',
  key: 'listTags',

  async run($) {
    const tags = {
      data: [],
    };

    const params = {
      page: 1,
      per_page: 100,
      order: 'desc',
    };

    let totalPages = 1;
    do {
      const { data, headers } = await $.http.get('?rest_route=/wp/v2/tags', {
        params,
      });

      params.page = params.page + 1;
      totalPages = Number(headers['x-wp-totalpages']);

      if (data) {
        for (const tag of data) {
          tags.data.push({
            value: tag.id,
            name: tag.name,
          });
        }
      }
    } while (params.page <= totalPages);

    return tags;
  },
};
