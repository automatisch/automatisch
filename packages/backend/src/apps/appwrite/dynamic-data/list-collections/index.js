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

    const params = {
      queries: [
        JSON.stringify({
          method: 'orderAsc',
          attribute: 'name',
        }),
        JSON.stringify({
          method: 'limit',
          values: [100],
        }),
      ],
    };

    const { data } = await $.http.get(
      `/v1/databases/${databaseId}/collections`,
      { params }
    );

    if (data?.collections) {
      for (const collection of data.collections) {
        collections.data.push({
          value: collection.$id,
          name: collection.name,
        });
      }
    }

    return collections;
  },
};
