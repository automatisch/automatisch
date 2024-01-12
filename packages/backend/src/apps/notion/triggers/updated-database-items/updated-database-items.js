const updatedDatabaseItems = async ($) => {
  const payload = {
    sorts: [
      {
        timestamp: 'last_edited_time',
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
          internalId: `${databaseItem.id}-${databaseItem.last_edited_time}`,
        },
      });
    }
  } while (payload.start_cursor);
};

export default updatedDatabaseItems;
