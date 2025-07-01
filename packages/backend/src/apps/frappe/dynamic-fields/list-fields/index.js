const hasValue = (value) => value !== null && value !== undefined;

export default {
  name: 'List fields',
  key: 'listFields',

  async run($) {
    const { doctype } = $.step.parameters;
    const options = [];

    if (!hasValue(doctype)) {
      return;
    }

    const { data } = await $.http.get(`/v2/doctype/${doctype}/meta`);

    const doctypeFields = data.data.fields || [];

    doctypeFields.forEach((field) => {
      if (
        field.hidden ||
        field.read_only ||
        field.fieldtype === 'Section Break' ||
        field.fieldtype === 'Column Break' ||
        field.fieldtype === 'Tab Break'
      )
        return;

      const required = !!field.reqd;

      const processedField = {
        label: field.label,
        key: field.fieldname,
        description: field.fieldtype && `The field type is ${field.fieldtype}.`,
        type: 'string',
        variables: true,
        required,
      };

      if (field.fieldtype === 'Select') {
        processedField.type = 'dropdown';
        processedField.variables = false;
        processedField.options = field.options?.split('\n').map((option) => ({
          label: option,
          value: option,
        }));
      } else if (field.fieldtype === 'Check') {
        processedField.type = 'dropdown';
        processedField.variables = false;
        processedField.options = [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ];
      }

      options.push(processedField);
    });

    return options;
  },
};
