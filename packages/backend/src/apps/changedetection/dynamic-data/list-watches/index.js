export default {
  name: 'List watches',
  key: 'listWatches',

  async run($) {
    const watches = {
      data: [],
    };

    const { data } = await $.http.get('/v1/watch');
    const watchIds = Object.keys(data);

    if (watchIds?.length) {
      for (const watchId of watchIds) {
        watches.data.push({
          value: watchId,
          name: data[watchId].url,
        });
      }
    }

    return watches;
  },
};
