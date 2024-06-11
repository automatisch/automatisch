export default {
  name: 'List organizations',
  key: 'listOrganizations',

  async run($) {
    const organizations = {
      data: [],
    };

    const params = {
      continuation: undefined,
    };

    do {
      const { data } = await $.http.get('/v3/users/me/organizations', {
        params,
      });

      if (data.pagination.has_more_items) {
        params.continuation = data.pagination.continuation;
      }

      if (data.organizations) {
        for (const organization of data.organizations) {
          organizations.data.push({
            value: organization.id,
            name: organization.name,
          });
        }
      }
    } while (params.continuation);

    return organizations;
  },
};
