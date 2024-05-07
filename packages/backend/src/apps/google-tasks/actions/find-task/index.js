import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find task',
  key: 'findTask',
  description: 'Looking for a specific task.',
  arguments: [
    {
      label: 'Task List',
      key: 'taskListId',
      type: 'dropdown',
      required: true,
      description: 'The list to be searched.',
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
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
  ],

  async run($) {
    const taskListId = $.step.parameters.taskListId;
    const title = $.step.parameters.title;

    const params = {
      showCompleted: true,
      showHidden: true,
    };

    const { data } = await $.http.get(`/tasks/v1/lists/${taskListId}/tasks`, {
      params,
    });

    const filteredTask = data.items?.filter((task) =>
      task.title.includes(title)
    );

    $.setActionItem({
      raw: filteredTask[0],
    });
  },
});
