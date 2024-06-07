import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find task in a project',
  key: 'findTaskInProject',
  description: 'Finds an existing task within a project.',
  arguments: [
    {
      label: 'Workspace',
      key: 'workspaceId',
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
            value: 'listWorkspaces',
          },
        ],
      },
    },
    {
      label: 'Project',
      key: 'projectId',
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
            value: 'listProjects',
          },
          {
            name: 'parameters.workspaceId',
            value: '{parameters.workspaceId}',
          },
        ],
      },
    },
    {
      label: 'Task Name',
      key: 'taskName',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
  ],

  async run($) {
    const { projectId, taskName } = $.step.parameters;

    const { data } = await $.http.get(`/1.0/projects/${projectId}/tasks`);

    const task = data.data.find((task) => task.name === taskName);

    $.setActionItem({
      raw: task,
    });
  },
});
