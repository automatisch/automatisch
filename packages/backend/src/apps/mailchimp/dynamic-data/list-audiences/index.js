export default {
  name: 'List audiences',
  key: 'listAudiences',

  async run($) {
    const audiences = {
      data: [],
    };
    let hasMore = false;

    const params = {
      sort_field: 'date_created',
      sort_dir: 'DESC',
      count: 1000,
      offset: 0,
    };

    do {
      const { data } = await $.http.get('/3.0/lists', { params });
      params.offset = params.offset + params.count;

      if (data?.lists) {
        for (const audience of data.lists) {
          audiences.data.push({
            value: audience.id,
            name: audience.name,
          });
        }
      }

      if (data.total_items > params.offset) {
        hasMore = true;
      } else {
        hasMore = false;
      }
    } while (hasMore);

    return audiences;
  },
};
