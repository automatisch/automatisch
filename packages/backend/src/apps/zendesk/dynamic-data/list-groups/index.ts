import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List groups',
  key: 'listGroups',

  async run($: IGlobalVariable) {
    const groups: {
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
      const response = await $.http.get('/api/v2/groups', { params });
      const allGroups = response?.data?.groups;
      hasMore = response?.data?.meta?.has_more;
      params['page[after]'] = response.data.meta?.after_cursor;

      if (allGroups?.length) {
        for (const group of allGroups) {
          groups.data.push({
            value: group.id,
            name: group.name,
          });
        }
      }
    } while (hasMore);

    return groups;
  },
};
