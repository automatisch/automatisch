import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New projects',
  key: 'newProjects',
  pollInterval: 15,
  description: 'Triggers when a new project is created.',
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
  ],

  async run($) {
    const workspaceId = $.step.parameters.workspaceId;

    const params = {
      limit: 100,
      offset: undefined,
      workspace: workspaceId,
    };

    do {
      const {
        data: { data, next_page },
      } = await $.http.get('/1.0/projects', {
        params,
      });

      params.offset = next_page?.offset;

      if (data) {
        for (const project of data) {
          $.pushTriggerItem({
            raw: project,
            meta: {
              internalId: project.gid,
            },
          });
        }
      }
    } while (params.offset);
  },
});
