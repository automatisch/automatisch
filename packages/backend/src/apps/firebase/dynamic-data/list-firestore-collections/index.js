export default {
  name: 'List firestore collections',
  key: 'listFirestoreCollections',

  async run($) {
    const firestoreCollections = {
      data: [],
    };
    const projectId = $.auth.data.projectId;

    const { data } = await $.http.post(
      `/v1/projects/${projectId}/databases/(default)/documents:listCollectionIds`,
      null,
      {
        additionalProperties: {
          setFirestoreBaseUrl: true,
        },
      }
    );

    if (data.collectionIds?.length) {
      for (const collectionId of data.collectionIds) {
        firestoreCollections.data.push({
          value: collectionId,
          name: collectionId,
        });
      }
    }

    return firestoreCollections;
  },
};
