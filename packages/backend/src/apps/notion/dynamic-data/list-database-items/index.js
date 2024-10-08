export default {
  name: 'List database items',
  key: 'listDatabaseItems',

  async run($) {
    const databases = {
      data: [],
      error: null,
    };
    const payload = {
      start_cursor: undefined,
    };
    const databaseId = $.step.parameters.databaseId;

    if (!databaseId) {
      return databases;
    }

    do {
      const response = await $.http.post(
        `/v1/databases/${databaseId}/query`,
        payload
      );

      payload.start_cursor = response.data.next_cursor;

      for (const database of response.data.results) {
        databases.data.push({
          value: database.id,
          name:
            database.properties.Name?.title?.[0]?.plain_text || 'Untitled Page',
        });
      }
    } while (payload.start_cursor);

    return databases;
  },
};
