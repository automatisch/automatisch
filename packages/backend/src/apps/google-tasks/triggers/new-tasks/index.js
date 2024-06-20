import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New tasks',
  key: 'newTasks',
  pollInterval: 15,
  description: 'Triggers when a new task is created.',
  arguments: [
    {
      label: 'Task List',
      key: 'taskListId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listTaskLists',
          },
        ],
      },
    },
  ],

  async run($) {
    const taskListId = $.step.parameters.taskListId;

    const params = {
      maxResults: 100,
      pageToken: undefined,
    };

    do {
      const { data } = await $.http.get(`/tasks/v1/lists/${taskListId}/tasks`);
      params.pageToken = data.nextPageToken;

      if (data.items?.length) {
        for (const task of data.items) {
          $.pushTriggerItem({
            raw: task,
            meta: {
              internalId: task.id,
            },
          });
        }
      }
    } while (params.pageToken);
  },
});
