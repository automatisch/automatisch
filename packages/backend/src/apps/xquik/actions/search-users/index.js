import defineAction from '../../../../helpers/define-action.js';
import compactParams from '../../common/compact-params.js';

export default defineAction({
  name: 'Search users',
  key: 'searchUsers',
  description: 'Search X users by name or username.',
  arguments: [
    {
      label: 'Query',
      key: 'q',
      type: 'string',
      required: true,
      variables: true,
      description: 'User search query.',
    },
    {
      label: 'Cursor',
      key: 'cursor',
      type: 'string',
      required: false,
      variables: true,
      description: 'Pagination cursor from a previous response.',
    },
  ],

  async run($) {
    const params = compactParams({
      q: $.step.parameters.q,
      cursor: $.step.parameters.cursor,
    });

    const { data } = await $.http.get('/x/users/search', { params });

    $.setActionItem({
      raw: data,
    });
  },
});
