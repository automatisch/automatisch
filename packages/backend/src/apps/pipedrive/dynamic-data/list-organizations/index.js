export default {
  name: 'List organizations',
  key: 'listOrganizations',

  async run($) {
    const organizations = {
      data: [],
    };

    const { data } = await $.http.get(
      `${$.auth.data.apiDomain}/api/v1/organizations`
    );

    if (data.data?.length) {
      for (const organization of data.data) {
        organizations.data.push({
          value: organization.id,
          name: organization.name,
        });
      }
    }

    return organizations;
  },
};
