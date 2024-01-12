export default {
  name: 'List fields',
  key: 'listFields',

  async run($) {
    const { object } = $.step.parameters;

    if (!object) return { data: [] };

    const response = await $.http.get(
      `/services/data/v56.0/sobjects/${object}/describe`
    );

    const fields = response.data.fields.map((field) => {
      return {
        value: field.name,
        name: field.label,
      };
    });

    return { data: fields };
  },
};
