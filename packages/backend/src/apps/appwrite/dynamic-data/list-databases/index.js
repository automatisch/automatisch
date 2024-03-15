export default {
  name: 'List databases',
  key: 'listDatabases',

  async run($) {
    const databases = {
      data: [],
    };

    const { data } = await $.http.get('/v1/databases');

    if (data?.databases) {
      const sortedDatabases = data.databases.sort((a, b) =>
        a.$createdAt - b.$createdAt ? 1 : -1
      );
      for (const database of sortedDatabases) {
        databases.data.push({
          value: database.$id,
          name: database.name,
        });
      }
    }

    return databases;
  },
};
