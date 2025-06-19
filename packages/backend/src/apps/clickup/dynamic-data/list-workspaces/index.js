export default {
  name: 'List workspaces',
  key: 'listWorkspaces',

  async run($) {
    const workspaces = {
      data: [],
    };

    const { data } = await $.http.get('/v2/team');

    if (data.teams) {
      for (const workspace of data.teams) {
        workspaces.data.push({
          value: workspace.id,
          name: workspace.name,
        });
      }
    }

    return workspaces;
  },
};
