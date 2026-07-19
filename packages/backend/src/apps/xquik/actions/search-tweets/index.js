import defineAction from '../../../../helpers/define-action.js';
import compactParams from '../../common/compact-params.js';

export default defineAction({
  name: 'Search tweets',
  key: 'searchTweets',
  description: 'Search public X tweets with query operators and pagination.',
  arguments: [
    {
      label: 'Query',
      key: 'q',
      type: 'string',
      required: true,
      variables: true,
      description: 'Search query, such as keywords, hashtags, or from:username.',
    },
    {
      label: 'Query type',
      key: 'queryType',
      type: 'dropdown',
      required: false,
      description: 'Sort order for search results.',
      value: 'Latest',
      options: [
        {
          label: 'Latest',
          value: 'Latest',
        },
        {
          label: 'Top',
          value: 'Top',
        },
      ],
    },
    {
      label: 'Limit',
      key: 'limit',
      type: 'string',
      required: false,
      variables: true,
      description: 'Maximum tweets to return. The API supports up to 200.',
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
      label: 'Since time',
      key: 'sinceTime',
      type: 'string',
      required: false,
      variables: true,
      description: 'ISO 8601 timestamp. Only return tweets after this time.',
    },
    {
      label: 'Until time',
      key: 'untilTime',
      type: 'string',
      required: false,
      variables: true,
      description: 'ISO 8601 timestamp. Only return tweets before this time.',
    },
  ],

  async run($) {
    const params = compactParams({
      q: $.step.parameters.q,
      queryType: $.step.parameters.queryType,
      limit: $.step.parameters.limit,
      cursor: $.step.parameters.cursor,
      sinceTime: $.step.parameters.sinceTime,
      untilTime: $.step.parameters.untilTime,
    });

    const { data } = await $.http.get('/x/tweets/search', { params });

    $.setActionItem({
      raw: data,
    });
  },
});
