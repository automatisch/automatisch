export default {
  name: 'List projects',
  key: 'listProjects',

  async run($) {
    const projects = {
      data: [],
    };
    const workspaceId = $.step.parameters.workspaceId;

    if (!workspaceId) {
      return projects;
    }

    const params = {
      limit: 100,
      offset: undefined,
      workspace: workspaceId,
    };

    do {
      const {
        data: { data, next_page },
      } = await $.http.get('/1.0/projects', {
        params,
      });

      params.offset = next_page?.offset;

      if (data) {
        for (const project of data) {
          projects.data.push({
            value: project.gid,
            name: project.name,
          });
        }
      }
    } while (params.offset);

    return projects;
  },
};
