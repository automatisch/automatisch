import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Copy board',
  key: 'copyBoard',
  description: 'Creates a copy of an existing board.',
  arguments: [
    {
      label: 'Original board',
      key: 'originalBoard',
      type: 'dropdown' as const,
      required: true,
      description: 'The board that you want to copy.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listBoards',
          },
        ],
      },
    },
    {
      label: 'Title',
      key: 'title',
      type: 'string' as const,
      required: true,
      description: 'Title for the board.',
      variables: true,
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string' as const,
      required: false,
      description: 'Description of the board.',
      variables: true,
    },
    {
      label: 'Team Access',
      key: 'teamAccess',
      type: 'dropdown' as const,
      required: false,
      description:
        'Team access to the board. Can be private, view, comment or edit. Default: private.',
      variables: true,
      options: [
        {
          label: 'Private - nobody in the team can find and access the board',
          value: 'private',
        },
        {
          label: 'View - any team member can find and view the board',
          value: 'view',
        },
        {
          label: 'Comment - any team member can find and comment the board',
          value: 'comment',
        },
        {
          label: 'Edit - any team member can find and edit the board',
          value: 'edit',
        },
      ],
    },
    {
      label: 'Access Via Link',
      key: 'accessViaLink',
      type: 'dropdown' as const,
      required: false,
      description:
        'Access to the board by link. Can be private, view, comment. Default: private.',
      variables: true,
      options: [
        {
          label: 'Private - only you have access to the board',
          value: 'private',
        },
        {
          label: 'View - can view, no sign-in required',
          value: 'view',
        },
        {
          label: 'Comment - can comment, no sign-in required',
          value: 'comment',
        },
      ],
    },
  ],

  async run($) {
    const params = {
      copy_from: $.step.parameters.originalBoard,
    };

    const body = {
      name: $.step.parameters.title,
      description: $.step.parameters.description,
      policy: {
        sharingPolicy: {
          access: $.step.parameters.accessViaLink || 'private',
          teamAccess: $.step.parameters.teamAccess || 'private',
        },
      },
    };

    const { data } = await $.http.put('/v2/boards', body, { params });

    $.setActionItem({
      raw: data,
    });
  },
});
