export default {
  name: 'List models',
  key: 'listModels',

  async run($) {
    const response = await $.http.get('/v1/models');

    const models = response.data.data.map((model) => {
      return {
        value: model.id,
        name: model.id,
      };
    });

    return { data: models };
  },
};
