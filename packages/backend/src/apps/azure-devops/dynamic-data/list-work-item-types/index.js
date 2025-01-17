export default {
  name: 'List work item types',
  key: 'listWorkItemTypes',

  async run($) {
    const workItemTypes = {
      data: [],
    };

    const projectId = $.step.parameters.projectId;

    const { data } = await $.http.get(`/${projectId}/_apis/wit/workitemtypes`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (data.value) {
      for (const itemType of data.value) {
        workItemTypes.data.push({
          name: itemType.name,
          value: itemType.referenceName,
        });
      }
    }

    return workItemTypes;
  },
};
