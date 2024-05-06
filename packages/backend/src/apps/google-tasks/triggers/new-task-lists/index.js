import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New task lists',
  key: 'newTaskLists',
  pollInterval: 15,
  description: 'Triggers when a new task list is created.',

  async run($) {
    const params = {
      maxResults: 100,
      pageToken: undefined,
    };

    do {
      const { data } = await $.http.get('/tasks/v1/users/@me/lists');
      params.pageToken = data.nextPageToken;

      if (data.items?.length) {
        for (const taskList of data.items.reverse()) {
          $.pushTriggerItem({
            raw: taskList,
            meta: {
              internalId: taskList.id,
            },
          });
        }
      }
    } while (params.pageToken);
  },
});
