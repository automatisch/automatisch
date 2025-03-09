import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find Cloud Firestore document',
  key: 'findCloudFirestoreDocument',
  description: 'Finds a document within a collection.',
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
      label: 'Document ID',
      key: 'documentId',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
  ],

  async run($) {
    const projectId = $.auth.data.projectId;
    const { collectionId, documentId } = $.step.parameters;

    const { data } = await $.http.get(
      `/v1/projects/${projectId}/databases/(default)/documents/${collectionId}/${documentId}`,
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
