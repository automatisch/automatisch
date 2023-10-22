import defineTrigger from '../../../../helpers/define-trigger';

type Payload = {
  start: number;
  limit: number;
  sort: string;
};

type ResponseData = {
  data: {
    id: number;
  }[];
  additional_data: {
    pagination: {
      next_start: number;
    };
  };
};

export default defineTrigger({
  name: 'New notes',
  key: 'newNotes',
  pollInterval: 15,
  description: 'Triggers when a new note is created.',
  arguments: [],

  async run($) {
    const params: Payload = {
      start: 0,
      limit: 100,
      sort: 'add_time DESC',
    };

    do {
      const { data } = await $.http.get<ResponseData>('/api/v1/notes', {
        params,
      });

      if (!data?.data?.length) {
        return;
      }

      params.start = data.additional_data?.pagination?.next_start;

      for (const note of data.data) {
        $.pushTriggerItem({
          raw: note,
          meta: {
            internalId: note.id.toString(),
          },
        });
      }
    } while (params.start);
  },
});
