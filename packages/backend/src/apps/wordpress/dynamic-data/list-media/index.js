export default {
  name: 'List media',
  key: 'listMedia',

  async run($) {
    const media = {
      data: [],
    };

    const params = {
      page: 1,
      per_page: 100,
      order: 'desc',
    };

    let totalPages = 1;
    do {
      const { data, headers } = await $.http.get('?rest_route=/wp/v2/media', {
        params,
      });

      params.page = params.page + 1;
      totalPages = Number(headers['x-wp-totalpages']);

      if (data) {
        for (const medium of data) {
          media.data.push({
            value: medium.id,
            name: medium.slug,
          });
        }
      }
    } while (params.page <= totalPages);

    return media;
  },
};
