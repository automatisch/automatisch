import defineAction from '../../../../helpers/define-action.js';
import omitBy from 'lodash/omitBy.js';
import isEmpty from 'lodash/isEmpty.js';

export default defineAction({
  name: 'Create project',
  key: 'createProject',
  description: 'Creates a new project.',
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
      label: 'Team',
      key: 'teamId',
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
            value: 'listTeams',
          },
          {
            name: 'parameters.workspaceId',
            value: '{parameters.workspaceId}',
          },
        ],
      },
    },
    {
      label: 'Due date',
      key: 'dueDate',
      type: 'string',
      required: false,
      description: 'Example due on: 2019-09-15',
      variables: true,
    },
    {
      label: 'Name',
      key: 'name',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Notes',
      key: 'notes',
      type: 'string',
      required: true,
      description: 'You can format the notes using html.',
      variables: true,
    },
    {
      label: 'Is the notes rich text?',
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
      label: 'Default View',
      key: 'defaultView',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        {
          label: 'List',
          value: 'list',
        },
        {
          label: 'Board',
          value: 'board',
        },
        {
          label: 'Calendar',
          value: 'calendar',
        },
        {
          label: 'Timeline',
          value: 'timeline',
        },
      ],
    },
    {
      label: 'Owner',
      key: 'ownerId',
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
  ],

  async run($) {
    const {
      workspaceId,
      teamId,
      dueDate,
      name,
      notes,
      richText,
      defaultView,
      ownerId,
      followerIds,
    } = $.step.parameters;

    const allFollowers = followerIds
      .map((followerId) => followerId.followerId)
      .filter(Boolean);

    const data = {
      workspace: workspaceId,
      team: teamId,
      due_on: dueDate,
      name,
      default_view: defaultView,
      owner: ownerId,
      followers: allFollowers,
    };

    if (richText === 'true') {
      data.html_notes = notes;
    } else {
      data.notes = notes;
    }

    const filteredData = omitBy(data, isEmpty);

    const response = await $.http.post('/1.0/projects', { data: filteredData });

    $.setActionItem({
      raw: response.data,
    });
  },
});
