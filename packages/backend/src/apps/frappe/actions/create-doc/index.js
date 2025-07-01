import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create New Document',
  key: 'createDoc',
  description: 'Creates a new document in Frappe.',
  arguments: [
    {
      label: 'Document Type',
      key: 'doctype',
      description: 'The type of the document to create.',
      type: 'dropdown',
      required: true,
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDoctypes',
          },
        ],
      },
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listFields',
          },
          {
            name: 'parameters.doctype',
            value: '{parameters.doctype}',
          },
        ],
      },
    },
  ],

  async run($) {
    const { doctype, ...rest } = $.step.parameters;
    const documentData = Object.entries(rest).reduce((result, [key, value]) => {
      if (Array.isArray(value)) {
        result[key] = value.map((item) => item.value);
      } else if (value !== '') {
        result[key] = value;
      }
      return result;
    }, {});

    const response = await $.http.post(`/v2/document/${doctype}`, documentData);

    $.setActionItem({ raw: response.data });
  },
});
