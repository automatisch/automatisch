import defineAction from '../../../../helpers/define-action.js';
import compactParams from '../../common/compact-params.js';

export default defineAction({
  name: 'List user tweets',
  key: 'listUserTweets',
  description: 'List recent tweets posted by an X user.',
  arguments: [
    {
      label: 'User ID or username',
      key: 'id',
      type: 'string',
      required: true,
      variables: true,
      description: 'X username without @, or numeric user ID.',
    },
    {
      label: 'Cursor',
      key: 'cursor',
      type: 'string',
      required: false,
      variables: true,
      description: 'Pagination cursor from a previous response.',
    },
    {
      label: 'Page size',
      key: 'pageSize',
      type: 'string',
      required: false,
      variables: true,
      description: 'Maximum tweets to request, from 1 to 100.',
    },
    {
      label: 'Include replies',
      key: 'includeReplies',
      type: 'dropdown',
      required: false,
      description: 'Include reply tweets.',
      value: false,
      variables: true,
      options: [
        {
          label: 'No',
          value: false,
        },
        {
          label: 'Yes',
          value: true,
        },
      ],
    },
    {
      label: 'Include parent tweet',
      key: 'includeParentTweet',
      type: 'dropdown',
      required: false,
      description: 'Include the parent tweet for replies.',
      value: false,
      variables: true,
      options: [
        {
          label: 'No',
          value: false,
        },
        {
          label: 'Yes',
          value: true,
        },
      ],
    },
  ],

  async run($) {
    const params = compactParams({
      cursor: $.step.parameters.cursor,
      pageSize: $.step.parameters.pageSize,
      includeReplies: $.step.parameters.includeReplies,
      includeParentTweet: $.step.parameters.includeParentTweet,
    });

    const { data } = await $.http.get(
      `/x/users/${$.step.parameters.id}/tweets`,
      { params }
    );

    $.setActionItem({
      raw: data,
    });
  },
});
