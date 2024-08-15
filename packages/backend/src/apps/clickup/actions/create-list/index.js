import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create list',
  key: 'createList',
  description: 'Creates a new list.',
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
      label: 'Space',
      key: 'spaceId',
      type: 'dropdown',
      required: true,
      dependsOn: ['parameters.workspaceId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSpaces',
          },
          {
            name: 'parameters.workspaceId',
            value: '{parameters.workspaceId}',
          },
        ],
      },
    },
    {
      label: 'Folder',
      key: 'folderId',
      type: 'dropdown',
      required: true,
      dependsOn: ['parameters.spaceId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listFolders',
          },
          {
            name: 'parameters.spaceId',
            value: '{parameters.spaceId}',
          },
        ],
      },
    },
    {
      label: 'List Name',
      key: 'listName',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'List Info',
      key: 'listInfo',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Priority',
      key: 'priority',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'Urgent', value: 1 },
        { label: 'High', value: 2 },
        { label: 'Normal', value: 3 },
        { label: 'Low', value: 4 },
      ],
    },
    {
      label: 'Due Date',
      key: 'dueDate',
      type: 'string',
      required: false,
      description: 'format: integer <int64>',
      variables: true,
    },
  ],

  async run($) {
    const { folderId, listName, listInfo, priority, dueDate } =
      $.step.parameters;

    const body = {
      name: listName,
      content: listInfo,
    };

    if (priority) {
      body.priority = priority;
    }

    if (dueDate) {
      body.due_date = dueDate;
    }

    const { data } = await $.http.post(`/v2/folder/${folderId}/list`, body);

    $.setActionItem({
      raw: data,
    });
  },
});
