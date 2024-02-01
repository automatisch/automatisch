export default {
  name: 'List templates',
  key: 'listTemplates',

  async run($) {
    const templates = {
      data: [],
    };

    const params = {
      sort_field: 'date_created',
      sort_dir: 'DESC',
      count: 1000,
      offset: 0,
    };

    const { data } = await $.http.get('/3.0/templates', { params });

    if (data?.templates) {
      for (const template of data.templates) {
        templates.data.push({
          value: template.id,
          name: template.name,
        });
      }
    }

    return templates;
  },
};
