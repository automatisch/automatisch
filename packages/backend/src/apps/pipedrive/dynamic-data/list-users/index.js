export default {
  name: 'List users',
  key: 'listUsers',

  async run($) {
    const users = {
      data: [],
    };

    const { data } = await $.http.get(`/v1/users`);

    if (data.data?.length) {
      for (const user of data.data) {
        users.data.push({
          value: user.id,
          name: user.name,
        });
      }
    }

    return users;
  },
};
