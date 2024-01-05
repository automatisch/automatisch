import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New event',
  key: 'newEvent',
  pollInterval: 15,
  description: 'Triggers when a new event is created.',
  arguments: [
    {
      label: 'Calendar',
      key: 'calendarId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listCalendars',
          },
        ],
      },
    },
  ],

  async run($) {
    const calendarId = $.step.parameters.calendarId;

    const params = {
      pageToken: undefined,
      orderBy: 'updated',
    };

    do {
      const { data } = await $.http.get(`/v3/calendars/${calendarId}/events`, {
        params,
      });
      params.pageToken = data.nextPageToken;

      if (data.items?.length) {
        for (const event of data.items.reverse()) {
          $.pushTriggerItem({
            raw: event,
            meta: {
              internalId: event.etag,
            },
          });
        }
      }
    } while (params.pageToken);
  },
});
