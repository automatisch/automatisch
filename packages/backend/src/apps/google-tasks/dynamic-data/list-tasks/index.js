export default {
  name: 'List tasks',
  key: 'listTasks',

  async run($) {
    const tasks = {
      data: [],
    };
    const taskListId = $.step.parameters.taskListId;

    const params = {
      maxResults: 100,
      pageToken: undefined,
    };

    if (!taskListId) {
      return tasks;
    }

    do {
      const { data } = await $.http.get(`/tasks/v1/lists/${taskListId}/tasks`, {
        params,
      });
      params.pageToken = data.nextPageToken;

      if (data.items) {
        for (const task of data.items) {
          if (task.title !== '') {
            tasks.data.push({
              value: task.id,
              name: task.title,
            });
          }
        }
      }
    } while (params.pageToken);

    return tasks;
  },
};
