import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New activities',
  key: 'newActivities',
  pollInterval: 15,
  description: 'Triggers when a new activity is created.',
  arguments: [],

  async run($) {
    const params = {
      start: 0,
      limit: 100,
      sort: 'add_time DESC',
    };

    do {
      const { data } = await $.http.get('/api/v1/activities', {
        params,
      });

      if (!data?.data?.length) {
        return;
      }

      params.start = data.additional_data?.pagination?.next_start;

      for (const activity of data.data) {
        $.pushTriggerItem({
          raw: activity,
          meta: {
            internalId: activity.id.toString(),
          },
        });
      }
    } while (params.start);
  },
});
