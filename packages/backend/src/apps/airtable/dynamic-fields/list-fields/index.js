const hasValue = (value) => value !== null && value !== undefined;

export default {
  name: 'List fields',
  key: 'listFields',

  async run($) {
    const options = [];
    const { baseId, tableId } = $.step.parameters;

    if (!hasValue(baseId) || !hasValue(tableId)) {
      return;
    }

    const { data } = await $.http.get(`/v0/meta/bases/${baseId}/tables`);

    const selectedTable = data.tables.find((table) => table.id === tableId);

    if (!selectedTable) return;

    selectedTable.fields.forEach((field) => {
      if (field.type === 'singleSelect') {
        options.push({
          label: field.name,
          key: field.name,
          type: 'dropdown',
          required: false,
          variables: true,
          options: field.options.choices.map((choice) => ({
            label: choice.name,
            value: choice.id,
          })),
        });
      } else if (field.type === 'multipleSelects') {
        options.push({
          label: field.name,
          key: field.name,
          type: 'dynamic',
          required: false,
          variables: true,
          fields: [
            {
              label: 'Value',
              key: 'value',
              type: 'dropdown',
              required: false,
              variables: true,
              options: field.options.choices.map((choice) => ({
                label: choice.name,
                value: choice.id,
              })),
            },
          ],
        });
      } else if (field.type === 'checkbox') {
        options.push({
          label: field.name,
          key: field.name,
          type: 'dropdown',
          required: false,
          variables: true,
          options: [
            {
              label: 'Yes',
              value: 'true',
            },
            {
              label: 'No',
              value: 'false',
            },
          ],
        });
      } else {
        options.push({
          label: field.name,
          key: field.name,
          type: 'string',
          required: false,
          variables: true,
        });
      }
    });

    return options;
  },
};
