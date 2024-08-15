export default {
  name: 'List tasks',
  key: 'listTasks',

  async run($) {
    const tasks = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM Calendar ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get('/webservice.php', { params });

    if (data.result?.length) {
      for (const task of data.result) {
        tasks.data.push({
          value: task.id,
          name: task.subject,
        });
      }
    }

    return tasks;
  },
};
