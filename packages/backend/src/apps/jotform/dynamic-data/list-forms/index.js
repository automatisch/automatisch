export default {
  name: 'List forms',
  key: 'listForms',

  async run($) {
    const forms = {
      data: [],
    };
    let hasMore = false;

    const params = {
      limit: 1000,
      offset: 0,
      orderby: 'created_at',
    };

    do {
      const { data } = await $.http.get('/user/forms', { params });
      params.offset = params.offset + params.limit;

      if (data.content?.length) {
        for (const form of data.content) {
          if (form.status === 'ENABLED') {
            forms.data.push({
              value: form.id,
              name: form.title,
            });
          }
        }
      }

      if (data.resultSet.count >= data.resultSet.limit) {
        hasMore = true;
      } else {
        hasMore = false;
      }
    } while (hasMore);

    return forms;
  },
};
