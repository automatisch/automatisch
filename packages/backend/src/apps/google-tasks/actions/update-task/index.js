import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Update task',
  key: 'updateTask',
  description: 'Updates an existing task.',
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
      label: 'Task',
      key: 'taskId',
      type: 'dropdown',
      required: true,
      description: 'Ensure that you choose a list before proceeding.',
      variables: true,
      dependsOn: ['parameters.taskListId'],
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listTasks',
          },
          {
            name: 'parameters.taskListId',
            value: '{parameters.taskListId}',
          },
        ],
      },
    },
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: false,
      description: 'Provide a new title for the revised task.',
      variables: true,
    },
    {
      label: 'Status',
      key: 'status',
      type: 'dropdown',
      required: false,
      description:
        'Specify the status of the updated task. If you opt for a custom value, enter either "needsAttention" or "completed."',
      variables: true,
      options: [
        { label: 'Incomplete', value: 'needsAction' },
        { label: 'Complete', value: 'completed' },
      ],
    },
    {
      label: 'Notes',
      key: 'notes',
      type: 'string',
      required: false,
      description: 'Provide a note for the revised task.',
      variables: true,
    },
    {
      label: 'Due Date',
      key: 'due',
      type: 'string',
      required: false,
      description:
        'Specify the deadline for the task (as a RFC 3339 timestamp).',
      variables: true,
    },
  ],

  async run($) {
    const { taskListId, taskId, title, status, notes, due } = $.step.parameters;

    const body = {
      title,
      status,
      notes,
      due,
    };

    const { data } = await $.http.patch(
      `/tasks/v1/lists/${taskListId}/tasks/${taskId}`,
      body
    );

    $.setActionItem({
      raw: data,
    });
  },
});
