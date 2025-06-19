export default {
  name: 'List forms',
  key: 'listForms',

  async run($) {
    const forms = await $.forms.getAll();

    return {
      data: forms.map((form) => ({
        value: form.id,
        name: form.name,
      })),
    };
  },
};
