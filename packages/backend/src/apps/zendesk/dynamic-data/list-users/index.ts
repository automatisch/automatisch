import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List users',
  key: 'listUsers',

  async run($: IGlobalVariable) {
    const users: {
      data: IJSONObject[];
    } = {
      data: [],
    };
    let hasMore;
    const showUserRole = $.step.parameters.showUserRole === 'true';
    const includeAdmins = $.step.parameters.includeAdmins === 'true';
    const role = includeAdmins ? ['admin', 'agent'] : ['agent'];

    const params = {
      'page[size]': 100,
      role,
      'page[after]': undefined as unknown as string,
    };

    do {
      const response = await $.http.get('/api/v2/users', { params });
      const allUsers = response?.data?.users;
      hasMore = response?.data?.meta?.has_more;
      params['page[after]'] = response.data.meta?.after_cursor;

      if (allUsers?.length) {
        for (const user of allUsers) {
          const name = showUserRole ? `${user.name} ${user.role}` : user.name;
          users.data.push({
            value: user.id,
            name,
          });
        }
      }
    } while (hasMore);

    return users;
  },
};
