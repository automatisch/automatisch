import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find Cloud Firestore document',
  key: 'findCloudFirestoreDocument',
  description: 'Finds a document within a collection.',
  arguments: [
    {
      label: 'Databse name',
      key: 'databaseName',
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
            value: 'listProjectDatabases',
          },
        ],
      },
    },
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
    const { collectionId, documentId, databaseName } = $.step.parameters;

    const { data } = await $.http.get(
      `/v1/${databaseName}/documents/${collectionId}/${documentId}`,
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
