import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create task',
  key: 'createTask',
  description: 'Creates a new task.',
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
      label: 'List',
      key: 'listId',
      type: 'dropdown',
      required: true,
      dependsOn: ['parameters.folderId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listLists',
          },
          {
            name: 'parameters.folderId',
            value: '{parameters.folderId}',
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
    {
      label: 'Task Description',
      key: 'taskDescription',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Markdown Content',
      key: 'markdownContent',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'False', value: 'false' },
        { label: 'True', value: 'true' },
      ],
    },
    {
      label: 'Assignees',
      key: 'assigneeIds',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Assignee',
          key: 'assigneeId',
          type: 'dropdown',
          required: false,
          dependsOn: ['parameters.listId'],
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listAssignees',
              },
              {
                name: 'parameters.listId',
                value: '{parameters.listId}',
              },
            ],
          },
        },
      ],
    },
    {
      label: 'Task Status',
      key: 'taskStatus',
      type: 'dropdown',
      required: false,
      dependsOn: ['parameters.listId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listStatuses',
          },
          {
            name: 'parameters.listId',
            value: '{parameters.listId}',
          },
        ],
      },
    },
    {
      label: 'Tags',
      key: 'tagIds',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'tag',
          key: 'tagId',
          type: 'dropdown',
          required: false,
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listTags',
              },
            ],
          },
        },
      ],
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
    {
      label: 'Start Date',
      key: 'startDate',
      type: 'string',
      required: false,
      description: 'format: integer <int64>',
      variables: true,
    },
  ],

  async run($) {
    const {
      listId,
      taskName,
      taskDescription,
      markdownContent,
      assigneeIds,
      taskStatus,
      tagIds,
      priority,
      dueDate,
      startDate,
    } = $.step.parameters;

    const tags = tagIds.map((tag) => tag.tagId);
    const assignees = assigneeIds.map((assignee) =>
      Number(assignee.assigneeId)
    );

    const body = {
      name: taskName,
    };

    if (assignees.length) {
      body.assignees = assignees;
    }

    if (taskStatus) {
      body.status = taskStatus;
    }

    if (tags.length) {
      body.tags = tags;
    }

    if (priority) {
      body.priority = priority;
    }

    if (dueDate) {
      body.due_date = dueDate;
    }

    if (startDate) {
      body.start_date = startDate;
    }

    if (markdownContent) {
      body.markdown_description = taskDescription;
    } else {
      body.description = taskDescription;
    }

    const { data } = await $.http.post(`/v2/list/${listId}/task`, body);

    $.setActionItem({
      raw: data,
    });
  },
});
