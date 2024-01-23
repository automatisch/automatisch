export default {
  name: 'List bases',
  key: 'listBases',

  async run($) {
    const bases = {
      data: [],
    };

    const params = {};

    do {
      const { data } = await $.http.get('/v0/meta/bases', { params });
      params.offset = data.offset;

      if (data?.bases) {
        for (const base of data.bases) {
          bases.data.push({
            value: base.id,
            name: base.name,
          });
        }
      }
    } while (params.offset);

    return bases;
  },
};
