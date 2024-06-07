export default {
  name: 'List teams',
  key: 'listTeams',

  async run($) {
    const teams = {
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
      } = await $.http.get('/1.0/teams', {
        params,
      });

      params.offset = next_page?.offset;

      if (data) {
        for (const team of data) {
          teams.data.push({
            value: team.gid,
            name: team.name,
          });
        }
      }
    } while (params.offset);

    return teams;
  },
};
