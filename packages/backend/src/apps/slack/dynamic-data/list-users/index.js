export default {
  name: 'List users',
  key: 'listUsers',

  async run($) {
    const users = {
      data: [],
      error: null,
    };

    let nextCursor;

    do {
      const response = await $.http.get('/users.list', {
        params: {
          cursor: nextCursor,
          limit: 1000,
        },
      });

      nextCursor = response.data.response_metadata?.next_cursor;

      if (response.data.error === 'missing_scope') {
        throw new Error(
          `Missing "${response.data.needed}" scope while authorizing. Please, reconnect your connection!`
        );
      }

      if (response.data.ok === false) {
        throw new Error(JSON.stringify(response.data, null, 2));
      }

      for (const member of response.data.members) {
        users.data.push({
          value: member.id,
          name: member.profile.real_name_normalized,
        });
      }
    } while (nextCursor);

    return users;
  },
};
