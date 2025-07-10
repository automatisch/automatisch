export default {
  name: 'List organizations',
  key: 'listOrganizations',

  async run($) {
    const organizations = {
      data: [],
    };

    const { data } = await $.http.get('/bigin/v2/org');

    if (data.org) {
      for (const org of data.org) {
        organizations.data.push({
          value: org.id,
          name: org.company_name,
        });
      }
    }

    return organizations;
  },
};
