export default {
  name: 'List contact owners',
  key: 'listContactOwners',

  async run($) {
    const contactOwners = {
      data: [],
    };

    const params = {
      type: 'AllUsers',
      page: 1,
      pageSize: 200,
    };

    let next = false;
    do {
      const { data } = await $.http.get('/bigin/v2/users', params);

      if (data.users.length === params.pageSize) {
        next = true;
        params.page = params.page + 1;
      } else {
        next = false;
      }

      if (data.users) {
        for (const user of data.users) {
          contactOwners.data.push({
            value: user.id,
            name: user.full_name,
          });
        }
      }
    } while (next);

    return contactOwners;
  },
};
