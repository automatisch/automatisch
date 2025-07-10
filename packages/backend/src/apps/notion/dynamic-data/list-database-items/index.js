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

    // Get database schema to find the title property
    const databaseResponse = await $.http.get(`/v1/databases/${databaseId}`);
    const databaseProperties = databaseResponse.data.properties;

    // Find the title property name
    const titlePropertyName = Object.keys(databaseProperties).find(
      (key) => databaseProperties[key].type === 'title'
    );

    do {
      const response = await $.http.post(
        `/v1/databases/${databaseId}/query`,
        payload
      );

      payload.start_cursor = response.data.next_cursor;

      for (const database of response.data.results) {
        let itemName = 'Untitled Page';

        // Use the actual title property name if found
        if (
          titlePropertyName &&
          database.properties[titlePropertyName]?.title?.[0]?.plain_text
        ) {
          itemName = database.properties[titlePropertyName].title[0].plain_text;
        }

        databases.data.push({
          value: database.id,
          name: itemName,
        });
      }
    } while (payload.start_cursor);

    return databases;
  },
};
