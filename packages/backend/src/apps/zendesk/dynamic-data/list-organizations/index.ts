import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List organizations',
  key: 'listOrganizations',

  async run($: IGlobalVariable) {
    const organizations: {
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
      const response = await $.http.get('/api/v2/organizations', { params });
      const allOrganizations = response?.data?.organizations;
      hasMore = response?.data?.meta?.has_more;
      params['page[after]'] = response.data.meta?.after_cursor;

      if (allOrganizations?.length) {
        for (const organization of allOrganizations) {
          organizations.data.push({
            value: organization.id,
            name: organization.name,
          });
        }
      }
    } while (hasMore);

    return organizations;
  },
};
