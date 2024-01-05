import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New calendar',
  key: 'newCalendar',
  pollInterval: 15,
  description: 'Triggers when a new calendar is created.',
  arguments: [],

  async run($) {
    const params = {
      pageToken: undefined,
      maxResults: 250,
    };

    do {
      const { data } = await $.http.get('/v3/users/me/calendarList', {
        params,
      });
      params.pageToken = data.nextPageToken;

      if (data.items?.length) {
        for (const calendar of data.items.reverse()) {
          $.pushTriggerItem({
            raw: calendar,
            meta: {
              internalId: calendar.etag,
            },
          });
        }
      }
    } while (params.pageToken);
  },
});
