export default {
  name: 'List posts',
  key: 'listPosts',

  async run($) {
    const posts = {
      data: [],
    };

    const params = {
      page: 1,
      per_page: 100,
      order: 'desc',
    };

    let totalPages = 1;
    do {
      const { data, headers } = await $.http.get('?rest_route=/wp/v2/posts', {
        params,
      });

      params.page = params.page + 1;
      totalPages = Number(headers['x-wp-totalpages']);

      if (data) {
        for (const post of data) {
          posts.data.push({
            value: post.id,
            name: post.title.rendered,
          });
        }
      }
    } while (params.page <= totalPages);

    return posts;
  },
};
