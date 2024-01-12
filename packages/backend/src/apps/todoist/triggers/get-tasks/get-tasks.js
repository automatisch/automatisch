const getActiveTasks = async ($) => {
  const params = {
    project_id: $.step.parameters.projectId?.trim(),
    section_id: $.step.parameters.sectionId?.trim(),
    label: $.step.parameters.label?.trim(),
    filter: $.step.parameters.filter?.trim(),
  };

  const response = await $.http.get('/tasks', { params });

  // todoist api doesn't offer sorting, so we inverse sort on id here
  response.data.sort((a, b) => {
    return b.id - a.id;
  });

  for (const task of response.data) {
    $.pushTriggerItem({
      raw: task,
      meta: {
        internalId: task.id,
      },
    });
  }
};

export default getActiveTasks;
