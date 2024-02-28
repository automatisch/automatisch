export default {
  name: 'List document data',
  key: 'listDocumentData',

  async run($) {
    if ($.step.parameters.useCustomJsonStructure) {
      return [
        {
          label: 'Data for the Document (JSON Payload)',
          key: 'customJsonPayload',
          type: 'string',
          required: false,
          description:
            'Use the JSON format { "firstname": "John", "lastname": "Doe" }.',
          variables: true,
        },
      ];
    } else {
      return [
        {
          label: 'Data for the Document',
          key: 'documentData',
          type: 'dynamic',
          required: false,
          description: '',
          fields: [
            {
              label: 'Key',
              key: 'documentDataKey',
              type: 'string',
              required: false,
              description: '',
              variables: true,
            },
            {
              label: 'Value',
              key: 'documentDataValue',
              type: 'string',
              required: false,
              description: '',
              variables: true,
            },
          ],
        },
      ];
    }
  },
};
