export default {
  name: 'List collections',
  key: 'listCollections',

  async run($) {
    const collections = {
      data: [],
    };
    const databaseId = $.step.parameters.databaseId;

    if (!databaseId) {
      return collections;
    }

    const { data } = await $.http.get(
      `/v1/databases/${databaseId}/collections`
    );

    if (data?.collections) {
      const sortedCollections = data.collections.sort((a, b) =>
        a.$createdAt - b.$createdAt ? 1 : -1
      );
      for (const collection of sortedCollections) {
        collections.data.push({
          value: collection.$id,
          name: collection.name,
        });
      }
    }

    return collections;
  },
};
