export default {
  name: 'List workspaces when using custom id',
  key: 'listFieldsWhenUsingCustomId',

  async run($) {
    if ($.step.parameters.useCustomId) {
      return [
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
      ];
    }
  },
};
