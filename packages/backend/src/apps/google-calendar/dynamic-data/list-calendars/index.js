export default {
  name: 'List calendars',
  key: 'listCalendars',

  async run($) {
    const drives = {
      data: [],
    };

    const params = {
      pageToken: undefined,
    };

    do {
      const { data } = await $.http.get(`/v3/users/me/calendarList`, {
        params,
      });
      params.pageToken = data.nextPageToken;

      if (data.items) {
        for (const calendar of data.items) {
          drives.data.push({
            value: calendar.id,
            name: calendar.summary,
          });
        }
      }
    } while (params.pageToken);

    return drives;
  },
};
