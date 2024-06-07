import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find project',
  key: 'findProject',
  description: 'Finds an existing project.',
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
      label: 'Name',
      key: 'name',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
  ],

  async run($) {
    const { workspaceId, name } = $.step.parameters;

    const { data } = await $.http.get(
      `/1.0/workspaces/${workspaceId}/projects`
    );

    const project = data.data.find((project) => project.name === name);

    $.setActionItem({
      raw: project,
    });
  },
});
