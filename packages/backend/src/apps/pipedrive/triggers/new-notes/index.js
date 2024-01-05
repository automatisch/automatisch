import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New notes',
  key: 'newNotes',
  pollInterval: 15,
  description: 'Triggers when a new note is created.',
  arguments: [],

  async run($) {
    const params = {
      start: 0,
      limit: 100,
      sort: 'add_time DESC',
    };

    do {
      const { data } = await $.http.get('/api/v1/notes', {
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
