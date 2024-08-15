export default {
  name: 'List databases',
  key: 'listDatabases',

  async run($) {
    const databases = {
      data: [],
    };

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

    const { data } = await $.http.get('/v1/databases', { params });

    if (data?.databases) {
      for (const database of data.databases) {
        databases.data.push({
          value: database.$id,
          name: database.name,
        });
      }
    }

    return databases;
  },
};
