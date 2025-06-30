export default {
  name: 'List users',
  key: 'listUsers',

  async run($) {
    const users = {
      data: [],
    };
    const workspaceId = $.step.parameters.workspaceId;

    if (!workspaceId) {
      return workspaceId;
    }

    const params = {
      limit: 100,
      offset: undefined,
      workspace: workspaceId,
    };

    do {
      const {
        data: { data, next_page },
      } = await $.http.get('/1.0/users', {
        params,
      });

      params.offset = next_page?.offset;

      if (data) {
        for (const user of data) {
          users.data.push({
            value: user.gid,
            name: user.name,
          });
        }
      }
    } while (params.offset);

    return users;
  },
};
