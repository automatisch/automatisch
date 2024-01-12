import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New leads',
  key: 'newLeads',
  pollInterval: 15,
  description: 'Triggers when a new lead is created.',
  arguments: [],

  async run($) {
    const params = {
      start: 0,
      limit: 100,
      sort: 'add_time DESC',
    };

    do {
      const { data } = await $.http.get('/api/v1/leads', {
        params,
      });

      if (!data?.data?.length) {
        return;
      }

      params.start = data.additional_data?.pagination?.next_start;

      for (const lead of data.data) {
        $.pushTriggerItem({
          raw: lead,
          meta: {
            internalId: lead.id.toString(),
          },
        });
      }
    } while (params.start);
  },
});
