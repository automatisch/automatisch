export default {
  name: 'List watches',
  key: 'listWatches',

  async run($) {
    const watches = {
      data: [],
    };

    const { data } = await $.http.get('/v1/watch');

    for (const [watchId, watchData] of Object.entries(data)) {
      watches.data.push({
        value: watchId,
        name: watchData.url,
      });
    }

    return watches;
  },
};
