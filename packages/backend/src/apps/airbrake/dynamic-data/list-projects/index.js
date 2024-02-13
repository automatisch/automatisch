export default {
  name: 'List projects',
  key: 'listProjects',

  async run($) {
    const projects = {
      data: [],
    };

    const { data } = await $.http.get('/api/v4/projects');

    if (data.projects.length) {
      for (const project of data.projects) {
        projects.data.push({
          value: project.id,
          name: project.name,
        });
      }
    }

    return projects;
  },
};
