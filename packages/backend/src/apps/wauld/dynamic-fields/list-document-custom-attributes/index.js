import getCustomAttributeKey from '../../common/get-custom-attribute-key.js';

export default {
  name: 'List document custom attribute fields',
  key: 'listDocumentCustomAttributeFields',

  async run($) {
    const documentId = $.step.parameters.documentId;

    if (!documentId) {
      return [];
    }

    const { data } = await $.http.post(
      '/wauld.DocumentService/GetDocument',
      {
        id: documentId,
      }
    );

    const document = data.document || data;

    const customAttributes = Array.isArray(document.customAttributes)
      ? document.customAttributes
      : [];

    return customAttributes
      .filter(
        (attributeName) =>
          typeof attributeName === 'string' &&
          attributeName.trim() &&
          attributeName.trim().toLowerCase() !== 'name'
      )
      .map((attributeName) => ({
        label: attributeName,
        key: getCustomAttributeKey(attributeName),
        type: 'string',
        required: false,
        variables: true,
        description:
          'Map the recipient-specific value for this custom field.',
      }));
  },
};