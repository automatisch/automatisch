import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type Database = {
  id: string;
  name: string;
  title: [
    {
      plain_text: string;
    }
  ];
}

type ResponseData = {
  results: Database[];
  next_cursor?: string;
}

type Payload = {
  filter: {
    value: 'database';
    property: 'object';
  };
  start_cursor?: string;
};

export default {
  name: 'List databases',
  key: 'listDatabases',

  async run($: IGlobalVariable) {
    const databases: {
      data: IJSONObject[];
      error: IJSONObject | null;
    } = {
      data: [],
      error: null,
    };
    const payload: Payload = {
      filter: {
        value: 'database',
        property: 'object'
      },
    };

    do {
      const response = await $.http.post<ResponseData>('/v1/search', payload);

      payload.start_cursor = response.data.next_cursor;

      for (const database of response.data.results) {
        databases.data.push({
          value: database.id as string,
          name: database.title[0].plain_text as string,
        });
      }
    } while (payload.start_cursor);

    return databases;
  },
};
