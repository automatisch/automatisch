import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New completed tasks',
  key: 'newCompletedTasks',
  pollInterval: 15,
  description: 'Triggers when a task is finished within a specified task list.',
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
      showCompleted: true,
      showHidden: true,
      pageToken: undefined,
    };

    do {
      const { data } = await $.http.get(`/tasks/v1/lists/${taskListId}/tasks`, {
        params,
      });
      params.pageToken = data.nextPageToken;

      if (data.items?.length) {
        for (const task of data.items) {
          if (task.status === 'completed') {
            $.pushTriggerItem({
              raw: task,
              meta: {
                internalId: task.id,
              },
            });
          }
        }
      }
    } while (params.pageToken);
  },
});
