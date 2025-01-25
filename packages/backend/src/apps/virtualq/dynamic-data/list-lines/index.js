export default {
  name: 'List lines',
  key: 'listLines',

  async run($) {
    const response = await $.http.get('/v2/lines');

    const lines = response.data.data.map((line) => ({
      value: line.id,
      name: line.attributes.name,
    }));

    return { data: lines };
  },
};
