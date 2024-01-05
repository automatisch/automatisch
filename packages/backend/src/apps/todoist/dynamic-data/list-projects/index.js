export default {
  name: 'List projects',
  key: 'listProjects',

  async run($) {
    const response = await $.http.get('/projects');

    response.data = response.data.map((project) => {
      return {
        value: project.id,
        name: project.name,
      };
    });

    return response;
  },
};
