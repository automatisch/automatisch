import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New video by search',
  key: 'newVideoBySearch',
  description:
    'Triggers when a new video is uploaded that matches a specific search string.',
  arguments: [
    {
      label: 'Query',
      key: 'query',
      type: 'string' as const,
      required: true,
      description: 'Search for videos that match this query.',
      variables: true,
    },
  ],

  async run($) {
    const query = $.step.parameters.query;

    const params = {
      pageToken: undefined as unknown as string,
      part: 'snippet',
      q: query,
      maxResults: 50,
      order: 'date',
      type: 'video',
    };

    do {
      const { data } = await $.http.get('/v3/search', { params });
      params.pageToken = data.nextPageToken;

      if (data?.items?.length) {
        for (const item of data.items) {
          $.pushTriggerItem({
            raw: item,
            meta: {
              internalId: item.etag,
            },
          });
        }
      }
    } while (params.pageToken);
  },
});
