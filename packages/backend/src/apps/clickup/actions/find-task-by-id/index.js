import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find task by id',
  key: 'findTaskById',
  description: 'Finds a task using id.',
  arguments: [
    {
      label: 'Task ID',
      key: 'taskId',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Use Custom ID',
      key: 'useCustomId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        {
          label: 'True',
          value: true,
        },
        {
          label: 'False',
          value: false,
        },
      ],
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listFieldsWhenUsingCustomId',
          },
          {
            name: 'parameters.useCustomId',
            value: '{parameters.useCustomId}',
          },
        ],
      },
    },
    {
      label: 'Include Subtasks?',
      key: 'includeSubtasks',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        {
          label: 'True',
          value: true,
        },
        {
          label: 'False',
          value: false,
        },
      ],
    },
  ],

  async run($) {
    const { taskId, useCustomId, includeSubtasks } = $.step.parameters;

    const params = {
      custom_task_ids: useCustomId || false,
      include_subtasks: includeSubtasks,
    };

    const { data } = await $.http.get(`/v2/task/${taskId}`, { params });

    $.setActionItem({
      raw: data,
    });
  },
});
