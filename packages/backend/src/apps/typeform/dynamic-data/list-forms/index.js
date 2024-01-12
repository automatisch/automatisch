export default {
  name: 'List forms',
  key: 'listForms',

  async run($) {
    const forms = {
      data: [],
    };

    const response = await $.http.get('/forms');

    forms.data = response.data.items.map((form) => {
      return {
        value: form.id,
        name: form.title,
      };
    });

    return forms;
  },
};
