const newDatabaseItems = async ($) => {
  const payload = {
    sorts: [
      {
        timestamp: 'created_time',
        direction: 'descending',
      },
    ],
  };

  const databaseId = $.step.parameters.databaseId;
  const path = `/v1/databases/${databaseId}/query`;
  do {
    const response = await $.http.post(path, payload);

    payload.start_cursor = response.data.next_cursor;

    for (const databaseItem of response.data.results) {
      $.pushTriggerItem({
        raw: databaseItem,
        meta: {
          internalId: databaseItem.id,
        },
      });
    }
  } while (payload.start_cursor);
};

export default newDatabaseItems;
