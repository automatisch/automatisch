import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New video in playlist',
  key: 'newVideoInPlaylist',
  pollInterval: 15,
  description:
    'Triggers when a new video is added to a specific Youtube playlist.',
  arguments: [
    {
      label: 'Playlist',
      key: 'playlistId',
      type: 'string',
      required: true,
      description: 'Get the new videos added to this playlist.',
      variables: true,
    },
  ],

  async run($) {
    const playlistId = $.step.parameters.playlistId;

    const params = {
      pageToken: undefined,
      part: 'snippet',
      playlistId: playlistId,
      maxResults: 50,
    };

    do {
      const { data } = await $.http.get('/v3/playlistItems', { params });
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
