import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New board',
  key: 'newBoard',
  pollInterval: 15,
  description: 'Triggers when a new board is created.',

  async run($) {
    const body = {
      query: 'query { boards(order_by: created_at) { id, name, type } }',
    };

    const { data } = await $.http.post('/', body);

    if (!data?.data?.boards?.length) {
      return;
    }

    for (const board of data.data.boards) {
      if (board.type === 'board') {
        $.pushTriggerItem({
          raw: board,
          meta: {
            internalId: board.id,
          },
        });
      }
    }
  },
});
