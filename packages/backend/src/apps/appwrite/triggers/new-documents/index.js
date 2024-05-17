import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New documents',
  key: 'newDocuments',
  pollInterval: 15,
  description: 'Triggers when a new document is created.',
  arguments: [
    {
      label: 'Database',
      key: 'databaseId',
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
            value: 'listDatabases',
          },
        ],
      },
    },
    {
      label: 'Collection',
      key: 'collectionId',
      type: 'dropdown',
      required: true,
      dependsOn: ['parameters.databaseId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listCollections',
          },
          {
            name: 'parameters.databaseId',
            value: '{parameters.databaseId}',
          },
        ],
      },
    },
  ],

  async run($) {
    const { databaseId, collectionId } = $.step.parameters;

    const limit = 1;
    let lastDocumentId = undefined;
    let offset = 0;
    let documentCount = 0;

    do {
      const params = {
        queries: [
          JSON.stringify({
            method: 'orderDesc',
            attribute: '$createdAt',
          }),
          JSON.stringify({
            method: 'limit',
            values: [limit],
          }),
          // An invalid cursor shouldn't be sent.
          lastDocumentId &&
            JSON.stringify({
              method: 'cursorAfter',
              values: [lastDocumentId],
            }),
        ].filter(Boolean),
      };

      const { data } = await $.http.get(
        `/v1/databases/${databaseId}/collections/${collectionId}/documents`,
        { params }
      );

      const documents = data?.documents;
      documentCount = documents?.length;
      offset = offset + limit;
      lastDocumentId = documents[documentCount - 1]?.$id;

      if (!documentCount) {
        return;
      }

      for (const document of documents) {
        $.pushTriggerItem({
          raw: document,
          meta: {
            internalId: document.$id,
          },
        });
      }
    } while (documentCount === limit);
  },
});
