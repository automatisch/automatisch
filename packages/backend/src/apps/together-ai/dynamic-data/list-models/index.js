export default {
  name: 'List models',
  key: 'listModels',

  async run($) {
    const { data } = await $.http.get('/v1/models');

    const models = data.map((model) => {
      return {
        value: model.id,
        name: model.display_name,
      };
    });

    return { data: models };
  },
};
