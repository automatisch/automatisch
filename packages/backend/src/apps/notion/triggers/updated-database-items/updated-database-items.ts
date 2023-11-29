import { IGlobalVariable } from '@automatisch/types';

type DatabaseItem = {
  id: string;
  last_edited_time: string;
};

type ResponseData = {
  results: DatabaseItem[];
  next_cursor?: string;
};

type Payload = {
  sorts: [
    {
      timestamp: 'created_time' | 'last_edited_time';
      direction: 'ascending' | 'descending';
    }
  ];
  start_cursor?: string;
};

const updatedDatabaseItems = async ($: IGlobalVariable) => {
  const payload: Payload = {
    sorts: [
      {
        timestamp: 'last_edited_time',
        direction: 'descending',
      },
    ],
  };

  const databaseId = $.step.parameters.databaseId as string;
  const path = `/v1/databases/${databaseId}/query`;
  do {
    const response = await $.http.post<ResponseData>(path, payload);

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
