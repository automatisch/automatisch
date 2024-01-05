export default {
  name: 'List databases',
  key: 'listDatabases',

  async run($) {
    const databases = {
      data: [],
      error: null,
    };
    const payload = {
      filter: {
        value: 'database',
        property: 'object',
      },
    };

    do {
      const response = await $.http.post('/v1/search', payload);

      payload.start_cursor = response.data.next_cursor;

      for (const database of response.data.results) {
        databases.data.push({
          value: database.id,
          name: database.title[0].plain_text,
        });
      }
    } while (payload.start_cursor);

    return databases;
  },
};
