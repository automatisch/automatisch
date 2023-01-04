import { IGlobalVariable } from '@automatisch/types';

const getActiveTasks = async ($: IGlobalVariable) => {

  const params = {
    project_id: ($.step.parameters.projectId as string)?.trim(),
    section_id: ($.step.parameters.sectionId as string)?.trim(),
    label: ($.step.parameters.label as string)?.trim(),
    filter: ($.step.parameters.filter as string)?.trim(),
  };

  const response = await $.http.get('/tasks', { params });

  // todoist api doesn't offer sorting, so we inverse sort on id here
  response.data.sort((a: { id: number; }, b: { id: number; }) => {
    return b.id - a.id;
  })

  for (const task of response.data) {
    $.pushTriggerItem({
      raw: task,
      meta:{
        internalId: task.id as string,
      }
    });
  }
};


export default getActiveTasks;
