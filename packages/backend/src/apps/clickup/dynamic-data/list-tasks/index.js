export default {
  name: 'List tasks',
  key: 'listTasks',

  async run($) {
    const tasks = {
      data: [],
    };
    const listId = $.step.parameters.listId;
    let next = false;

    if (!listId) {
      return tasks;
    }

    const params = {
      order_by: 'created',
      reverse: true,
    };

    do {
      const { data } = await $.http.get(`/v2/list/${listId}/task`, { params });
      if (data.last_page) {
        next = false;
      } else {
        next = true;
      }

      if (data.tasks) {
        for (const task of data.tasks) {
          tasks.data.push({
            value: task.id,
            name: task.name,
          });
        }
      }
    } while (next);

    return tasks;
  },
};
