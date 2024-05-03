import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New board',
  key: 'newBoard',
  pollInterval: 15,
  description: 'Triggers when a new board is created.',

  async run($) {
    const body = {
      query: 'query { boards { id, name } }',
    };

    const { data } = await $.http.post('/', body);

    if (!data?.data?.boards?.length) {
      return;
    }

    for (const board of data.data.boards) {
      $.pushTriggerItem({
        raw: board,
        meta: {
          internalId: board.id,
        },
      });
    }
  },
});
