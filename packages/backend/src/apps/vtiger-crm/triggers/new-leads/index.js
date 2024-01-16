import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New leads',
  key: 'newLeads',
  pollInterval: 15,
  description: 'Triggers when a new lead is created.',

  async run($) {
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: `SELECT * FROM Leads ORDER BY createdtime DESC LIMIT ${offset}, ${limit};`,
    };

    do {
      const { data } = await $.http.get('/webservice.php', {
        params,
      });
      offset = limit + offset;

      if (!data?.result?.length) {
        hasMore = false;
        return;
      }

      for (const item of data.result) {
        $.pushTriggerItem({
          raw: item,
          meta: {
            internalId: item.id,
          },
        });
      }
    } while (hasMore);
  },
});
