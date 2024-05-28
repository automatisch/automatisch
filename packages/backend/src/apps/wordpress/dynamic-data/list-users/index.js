export default {
  name: 'List users',
  key: 'listUsers',

  async run($) {
    const users = {
      data: [],
    };

    const params = {
      page: 1,
      per_page: 100,
      order: 'desc',
    };

    let totalPages = 1;
    do {
      const { data, headers } = await $.http.get('?rest_route=/wp/v2/users', {
        params,
      });

      params.page = params.page + 1;
      totalPages = Number(headers['x-wp-totalpages']);

      if (data) {
        for (const user of data) {
          users.data.push({
            value: user.id,
            name: user.name,
          });
        }
      }
    } while (params.page <= totalPages);

    return users;
  },
};
