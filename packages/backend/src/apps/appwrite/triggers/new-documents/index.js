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

    const { data } = await $.http.get(
      `/v1/databases/${databaseId}/collections/${collectionId}/documents`
    );

    if (!data?.documents?.length) {
      return;
    }

    const sortedDocuments = data.documents.sort((a, b) =>
      a.$createdAt - b.$createdAt ? 1 : -1
    );

    for (const document of sortedDocuments) {
      $.pushTriggerItem({
        raw: document,
        meta: {
          internalId: document.$id,
        },
      });
    }
  },
});
