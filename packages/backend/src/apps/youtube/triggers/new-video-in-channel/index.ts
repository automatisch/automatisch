import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New video in channel',
  key: 'newVideoInChannel',
  description:
    'Triggers when a new video is published to a specific Youtube channel.',
  arguments: [
    {
      label: 'Channel',
      key: 'channelId',
      type: 'string' as const,
      required: true,
      description:
        'Get the new videos uploaded to this channel. If the URL of the youtube channel looks like this www.youtube.com/channel/UCbxb2fqe9oNgglAoYqsYOtQ then you must use UCbxb2fqe9oNgglAoYqsYOtQ as a value in this field.',
      variables: true,
    },
  ],

  async run($) {
    const channelId = $.step.parameters.channelId as string;

    const params = {
      pageToken: undefined as unknown as string,
      part: 'snippet',
      channelId: channelId,
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
