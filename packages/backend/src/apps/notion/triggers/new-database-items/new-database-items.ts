import { IGlobalVariable } from '@automatisch/types';

type DatabaseItem = {
  id: string;
}

type ResponseData = {
  results: DatabaseItem[];
  next_cursor?: string;
}

type Payload = {
  sorts: [
    {
      timestamp: 'created_time' | 'last_edited_time';
      direction: 'ascending' | 'descending';
    }
  ];
  start_cursor?: string;
};

const newDatabaseItems = async ($: IGlobalVariable) => {
  const payload: Payload = {
    sorts: [
      {
        timestamp: 'created_time',
        direction: 'descending'
      }
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
          internalId: databaseItem.id,
        }
      })
    }
  } while (payload.start_cursor);
};

export default newDatabaseItems;
