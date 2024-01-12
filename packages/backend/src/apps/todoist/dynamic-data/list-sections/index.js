export default {
  name: 'List sections',
  key: 'listSections',

  async run($) {
    const params = {
      project_id: $.step.parameters.projectId,
    };

    const response = await $.http.get('/sections', { params });

    response.data = response.data.map((section) => {
      return {
        value: section.id,
        name: section.name,
      };
    });

    return response;
  },
};
