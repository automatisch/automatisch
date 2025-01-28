import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Edit Work Item',
  key: 'editWorkItem',
  description: 'Edits an existing work item in Azure DevOps.',
  arguments: [
    {
      label: 'Project',
      key: 'projectId',
      type: 'dropdown',
      required: true,
      description: 'The project containing the work item to edit.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listProjects',
          },
        ],
      },
    },
    {
      label: 'Work Item ID',
      key: 'workItemId',
      type: 'string',
      required: true,
      description: 'The ID of the work item to edit.',
      variables: true,
    },
    {
      label: 'Work Item Type',
      key: 'workItemType',
      type: 'dropdown',
      dependsOn: ['parameters.project'],
      required: true,
      description: 'The type of work item to create.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listWorkItemTypes',
          },
          {
            name: 'parameters.projectId',
            value: '{parameters.projectId}',
          },
        ],
      },
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listWorkItemTypeFields',
          },
          {
            name: 'parameters.workItemType',
            value: '{parameters.workItemType}',
          },
          {
            name: 'parameters.projectId',
            value: '{parameters.projectId}',
          },
        ],
      },
    },
  ],

  async run($) {
    const { projectId, workItemId, ...rest } = $.step.parameters;
    const body = Object.entries(rest)
      .filter(
        ([, value]) => value !== '' && value !== null && value !== undefined,
      )
      .map(([key, value]) => ({
        op: 'add',
        // Azure DevOps uses dots to label the field name. We replace double underscores that we set before with dots in the field name to match the Azure DevOps API.
        // See the dynamic fields query listWorkItemTypeFields for more details.
        path: `/fields/${key.replace('__', '.')}`,
        value,
      }));

    const { data } = await $.http.patch(
      `/${projectId}/_apis/wit/workitems/${workItemId}`,
      body,
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      },
    );

    $.setActionItem({
      raw: data,
    });
  },
});
