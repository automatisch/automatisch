export default {
  name: 'List categories',
  key: 'listCategories',

  async run($) {
    const categories = {
      data: [],
    };

    const params = {
      page: 1,
      per_page: 100,
      order: 'desc',
    };

    let totalPages = 1;
    do {
      const { data, headers } = await $.http.get(
        '?rest_route=/wp/v2/categories',
        {
          params,
        }
      );

      params.page = params.page + 1;
      totalPages = Number(headers['x-wp-totalpages']);

      if (data) {
        for (const category of data) {
          categories.data.push({
            value: category.id,
            name: category.name,
          });
        }
      }
    } while (params.page <= totalPages);

    return categories;
  },
};
