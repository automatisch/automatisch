import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Update Existing Document',
  key: 'updateDoc',
  description: 'Updates an existing document in Frappe.',
  arguments: [
    {
      label: 'Document Type',
      key: 'doctype',
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
    {
      label: 'Document Name',
      key: 'documentName',
      type: 'string',
      required: true,
      description: 'The name of the document to update.',
      variables: true,
    },
  ],

  async run($) {
    const { doctype, documentName, ...rest } = $.step.parameters;
    const dataToUpdate = Object.entries(rest).reduce((result, [key, value]) => {
      if (Array.isArray(value)) {
        result[key] = value.map((item) => item.value);
      } else if (value !== '') {
        result[key] = value;
      }
      return result;
    }, {});

    const response = await $.http.patch(
      `/v2/document/${doctype}/${documentName}`,
      dataToUpdate
    );
    $.setActionItem({ raw: response.data });
  },
});
