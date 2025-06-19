export default {
  name: 'List models',
  key: 'listModels',

  async run($) {
    const models = {
      data: [],
    };

    const params = {
      limit: 999,
    };

    let hasMore = false;

    do {
      const { data } = await $.http.get('/v1/models', { params });
      params.after_id = data.last_id;
      hasMore = data.has_more;

      for (const base of data.data) {
        models.data.push({
          value: base.id,
          name: base.display_name,
        });
      }
    } while (hasMore);

    return models;
  },
};
