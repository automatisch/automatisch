import defineAction from '../../../../helpers/define-action.js';
import omitBy from 'lodash/omitBy.js';
import isEmpty from 'lodash/isEmpty.js';

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
      label: 'Project',
      key: 'projectId',
      type: 'dropdown',
      required: false,
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
      label: 'Section',
      key: 'sectionId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSections',
          },
          {
            name: 'parameters.projectId',
            value: '{parameters.projectId}',
          },
        ],
      },
    },
    {
      label: 'Due date type',
      key: 'dueDateType',
      type: 'dropdown',
      required: false,
      description: "If not filled in, 'Date & time' will be assumed.",
      options: [
        {
          label: 'Date & time',
          value: 'at',
        },
        {
          label: 'Date only',
          value: 'on',
        },
      ],
    },
    {
      label: 'Due date (date & time)',
      key: 'dueDate',
      type: 'string',
      required: false,
      description:
        'Example due at: 2019-09-15T02:06:58.147Z, example due on: 2019-09-15',
      variables: true,
    },
    {
      label: 'Name',
      key: 'name',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string',
      required: false,
      description: 'You can format the description using html.',
      variables: true,
    },
    {
      label: 'Is the description rich text?',
      key: 'richText',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        {
          label: 'No',
          value: 'false',
        },
        {
          label: 'Yes',
          value: 'true',
        },
      ],
    },
    {
      label: 'Mark Task as complete?',
      key: 'taskCompleted',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        {
          label: 'No',
          value: 'false',
        },
        {
          label: 'Yes',
          value: 'true',
        },
      ],
    },
    {
      label: 'Mark Task as liked?',
      key: 'taskLiked',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        {
          label: 'No',
          value: 'false',
        },
        {
          label: 'Yes',
          value: 'true',
        },
      ],
    },
    {
      label: 'Assignee',
      key: 'assigneeId',
      type: 'dropdown',
      required: false,
      dependsOn: ['parameters.workspaceId'],
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listUsers',
          },
          {
            name: 'parameters.workspaceId',
            value: '{parameters.workspaceId}',
          },
        ],
      },
    },
    {
      label: 'Followers',
      key: 'followerIds',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Follower',
          key: 'followerId',
          type: 'dropdown',
          required: false,
          dependsOn: ['parameters.workspaceId'],
          description: '',
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listUsers',
              },
              {
                name: 'parameters.workspaceId',
                value: '{parameters.workspaceId}',
              },
            ],
          },
        },
      ],
    },
    {
      label: 'Tags',
      key: 'tagIds',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Tag',
          key: 'tagId',
          type: 'dropdown',
          required: false,
          dependsOn: ['parameters.workspaceId'],
          description: '',
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listTags',
              },
              {
                name: 'parameters.workspaceId',
                value: '{parameters.workspaceId}',
              },
            ],
          },
        },
      ],
    },
  ],

  async run($) {
    const {
      workspaceId,
      projectId,
      sectionId,
      dueDateType,
      dueDate,
      name,
      description,
      richText,
      taskCompleted,
      taskLiked,
      assigneeId,
      followerIds,
      tagIds,
    } = $.step.parameters;

    const allFollowers = followerIds
      .map((followerId) => followerId.followerId)
      .filter(Boolean);

    const allTags = tagIds.map((tagId) => tagId.tagId).filter(Boolean);

    const data = {
      name,
      completed: taskCompleted,
      liked: taskLiked,
      assignee: assigneeId,
      assignee_section: sectionId,
      followers: allFollowers,
      projects: projectId,
      tags: allTags,
      workspace: workspaceId,
    };

    if (richText === 'true') {
      data.html_notes = description;
    } else {
      data.notes = description;
    }

    if (dueDateType === 'on') {
      data.due_on = dueDate;
    } else {
      data.due_at = dueDate;
    }

    const filteredData = omitBy(data, isEmpty);

    const response = await $.http.post('/1.0/tasks', { data: filteredData });

    $.setActionItem({
      raw: response.data,
    });
  },
});
