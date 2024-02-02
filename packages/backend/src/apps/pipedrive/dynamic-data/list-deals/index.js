export default {
  name: 'List deals',
  key: 'listDeals',

  async run($) {
    const deals = {
      data: [],
    };

    const params = {
      sort: 'add_time DESC',
    };

    const { data } = await $.http.get(`${$.auth.data.apiDomain}/api/v1/deals`, {
      params,
    });

    if (data.data?.length) {
      for (const deal of data.data) {
        deals.data.push({
          value: deal.id,
          name: deal.title,
        });
      }
    }

    return deals;
  },
};
