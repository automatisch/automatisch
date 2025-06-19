export default {
  name: 'List workspaces',
  key: 'listWorkspaces',

  async run($) {
    const workspaces = {
      data: [],
    };

    const params = {
      limit: 100,
      offset: undefined,
    };

    do {
      const {
        data: { data, next_page },
      } = await $.http.get('/1.0/workspaces', { params });

      params.offset = next_page?.offset;

      if (data) {
        for (const workspace of data) {
          workspaces.data.push({
            value: workspace.gid,
            name: workspace.name,
          });
        }
      }
    } while (params.offset);

    return workspaces;
  },
};
