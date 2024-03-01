import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create Cloud Firestore document',
  key: 'createCloudFirestoreDocument',
  description: 'Creates a new document within a Cloud Firestore collection.',
  arguments: [
    {
      label: 'Collection',
      key: 'collectionId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listFirestoreCollections',
          },
        ],
      },
    },
    {
      label: 'Convert Numerics',
      key: 'convertNumerics',
      type: 'dropdown',
      required: false,
      description:
        "If any value represents a valid numerical value, whether it's an integer or a floating-point number, this field directs the database to store it as a numeric data type instead of a string.",
      variables: true,
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    {
      label: 'Document ID',
      key: 'documentId',
      type: 'string',
      required: false,
      description:
        'The document ID to use for this document. If not specified, an ID will be assigned.',
      variables: true,
    },
    {
      label: 'Document Data',
      key: 'documentData',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Key',
          key: 'key',
          type: 'string',
          required: false,
          variables: true,
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string',
          required: false,
          variables: true,
        },
      ],
    },
  ],

  async run($) {
    const projectId = $.auth.data.projectId;
    const { collectionId, documentId, documentData, convertNumerics } =
      $.step.parameters;

    const documentDataObject = documentData.reduce((result, entry) => {
      const key = entry.key?.toLowerCase();
      const value = entry.value;
      const isNumber = !isNaN(parseFloat(value));

      if (key && value) {
        const formattedValue =
          convertNumerics && isNumber
            ? { integerValue: parseFloat(value) }
            : { stringValue: value };

        return {
          ...result,
          [key]: formattedValue,
        };
      }

      return result;
    }, {});

    const body = {
      fields: documentDataObject,
    };

    const { data } = await $.http.post(
      `/v1/projects/${projectId}/databases/(default)/documents/${collectionId}?documentId=${documentId}`,
      body,
      {
        additionalProperties: {
          setFirestoreBaseUrl: true,
        },
      }
    );

    $.setActionItem({
      raw: data,
    });
  },
});
