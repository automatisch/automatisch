export default {
  name: 'List task lists',
  key: 'listTaskLists',

  async run($) {
    const taskLists = {
      data: [],
    };

    const params = {
      maxResults: 100,
      pageToken: undefined,
    };

    do {
      const { data } = await $.http.get('/tasks/v1/users/@me/lists', {
        params,
      });
      params.pageToken = data.nextPageToken;

      if (data.items) {
        for (const taskList of data.items) {
          taskLists.data.push({
            value: taskList.id,
            name: taskList.title,
          });
        }
      }
    } while (params.pageToken);

    return taskLists;
  },
};
