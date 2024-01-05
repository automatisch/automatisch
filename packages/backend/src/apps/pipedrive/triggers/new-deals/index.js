import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New deals',
  key: 'newDeals',
  pollInterval: 15,
  description: 'Triggers when a new deal is created.',
  arguments: [],

  async run($) {
    const params = {
      start: 0,
      limit: 100,
      sort: 'add_time DESC',
    };

    do {
      const { data } = await $.http.get('/api/v1/deals', {
        params,
      });

      if (!data?.data?.length) {
        return;
      }

      params.start = data.additional_data?.pagination?.next_start;

      for (const deal of data.data) {
        $.pushTriggerItem({
          raw: deal,
          meta: {
            internalId: deal.id.toString(),
          },
        });
      }
    } while (params.start);
  },
});
