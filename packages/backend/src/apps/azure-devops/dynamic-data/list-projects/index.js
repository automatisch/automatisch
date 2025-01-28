export default {
  name: 'List projects',
  key: 'listProjects',

  async run($) {
    const workItemTypes = {
      data: [],
    };

    const { data } = await $.http.get(`/_apis/projects`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (data.value) {
      for (const itemType of data.value) {
        workItemTypes.data.push({
          name: itemType.name,
          value: itemType.id,
        });
      }
    }

    return workItemTypes;
  },
};
