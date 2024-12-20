export default {
  name: 'List waiters',
  key: 'listWaiters',

  async run($) {
    const response = await $.http.get('/v2/waiters');

    const lines = response.data.data.map((line) => ({
      value: line.id,
      name: line.attributes.name,
    }));

    return { data: lines };
  },
};
