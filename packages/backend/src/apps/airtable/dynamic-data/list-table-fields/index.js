export default {
  name: 'List table fields',
  key: 'listTableFields',

  async run($) {
    const tableFields = {
      data: [],
    };
    const { baseId, tableId } = $.step.parameters;

    if (!baseId) {
      return tableFields;
    }

    const params = {};

    do {
      const { data } = await $.http.get(`/v0/meta/bases/${baseId}/tables`, {
        params,
      });
      params.offset = data.offset;

      if (data?.tables) {
        for (const table of data.tables) {
          if (table.id === tableId) {
            table.fields.forEach((field) => {
              tableFields.data.push({
                value: field.name,
                name: field.name,
              });
            });
          }
        }
      }
    } while (params.offset);

    return tableFields;
  },
};
