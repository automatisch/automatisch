import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List views',
  key: 'listViews',

  async run($: IGlobalVariable) {
    const views: {
      data: IJSONObject[];
    } = {
      data: [],
    };
    let hasMore;

    const params = {
      'page[size]': 100,
      'page[after]': undefined as unknown as string,
    };

    do {
      const response = await $.http.get('/api/v2/views', { params });
      const allViews = response?.data?.views;
      hasMore = response?.data?.meta?.has_more;
      params['page[after]'] = response.data.meta?.after_cursor;

      if (allViews?.length) {
        for (const view of allViews) {
          views.data.push({
            value: view.id,
            name: view.title,
          });
        }
      }
    } while (hasMore);

    return views;
  },
};
