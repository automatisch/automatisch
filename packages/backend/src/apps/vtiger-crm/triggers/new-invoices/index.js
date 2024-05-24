import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New invoices',
  key: 'newInvoices',
  pollInterval: 15,
  description: 'Triggers when a new invoice is created.',

  async run($) {
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    do {
      const params = {
        operation: 'query',
        sessionName: $.auth.data.sessionName,
        query: `SELECT * FROM Invoice ORDER BY createdtime DESC LIMIT ${offset}, ${limit};`,
      };

      const { data } = await $.http.get('/webservice.php', {
        params,
      });
      offset = limit + offset;

      if (!data.result?.length || data.result.length < limit) {
        hasMore = false;
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
