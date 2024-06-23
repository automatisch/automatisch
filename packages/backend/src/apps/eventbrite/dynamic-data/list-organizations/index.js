export default {
  name: 'List organisations',
  key: 'listOrganizations',

  async run($) {
    const response = await $.http.get('/users/me/organizations');

    response.data = response.data['organizations'].map((organization) => {
      return {
        value: organization.id,
        name: organization.name,
      };
    });

    return response;
  },
};
