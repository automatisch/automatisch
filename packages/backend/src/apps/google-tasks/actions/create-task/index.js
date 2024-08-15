import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create task',
  key: 'createTask',
  description: 'Creates a new task.',
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
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Notes',
      key: 'notes',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Due Date',
      key: 'due',
      type: 'string',
      required: false,
      description: 'RFC 3339 timestamp.',
      variables: true,
    },
  ],

  async run($) {
    const { taskListId, title, notes, due } = $.step.parameters;

    const body = {
      title,
      notes,
      due,
    };

    const { data } = await $.http.post(
      `/tasks/v1/lists/${taskListId}/tasks`,
      body
    );

    $.setActionItem({
      raw: data,
    });
  },
});
