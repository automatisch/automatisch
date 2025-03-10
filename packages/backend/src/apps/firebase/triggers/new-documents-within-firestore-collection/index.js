import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New documents within a firestore collection',
  key: 'newDocumentsWithinFirestoreCollection',
  pollInterval: 15,
  description:
    'Triggers when a new document is added within a Cloud Firestore collection.',
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
  ],

  async run($) {
    const { collectionId, databaseName } = $.step.parameters;
    const params = {
      pageSize: 100,
      pageToken: undefined,
    };

    do {
      const { data } = await $.http.get(
        `/v1/${databaseName}/documents/${collectionId}`,
        {
          params,
          additionalProperties: {
            setFirestoreBaseUrl: true,
          },
        }
      );
      params.pageToken = data.nextPageToken;

      if (!data?.documents?.length) {
        return;
      }

      for (const document of data.documents) {
        const nameParts = document.name.split('/');
        const id = nameParts[nameParts.length - 1];
        $.pushTriggerItem({
          raw: document,
          meta: {
            internalId: id,
          },
        });
      }
    } while (params.pageToken);
  },
});
