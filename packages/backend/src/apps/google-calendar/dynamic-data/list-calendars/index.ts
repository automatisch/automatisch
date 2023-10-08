import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List calendars',
  key: 'listCalendars',

  async run($: IGlobalVariable) {
    const drives: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      pageToken: undefined as unknown as string,
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
