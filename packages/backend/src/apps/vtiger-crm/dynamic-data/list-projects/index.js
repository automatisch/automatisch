export default {
  name: 'List projects',
  key: 'listProjects',

  async run($) {
    const projects = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM Project ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get('/webservice.php', { params });

    if (data.result?.length) {
      for (const project of data.result) {
        projects.data.push({
          value: project.id,
          name: project.projectname,
        });
      }
    }

    return projects;
  },
};
