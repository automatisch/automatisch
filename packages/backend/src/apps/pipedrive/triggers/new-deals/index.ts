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
  name: 'New deals',
  key: 'newDeals',
  pollInterval: 15,
  description: 'Triggers when a new deal is created.',
  arguments: [],

  async run($) {
    const params: Payload = {
      start: 0,
      limit: 100,
      sort: 'add_time DESC',
    };

    do {
      const { data } = await $.http.get<ResponseData>('/api/v1/deals', {
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
