export default {
  name: 'List Models',
  key: 'listModels',

  async run($) {

    let response = await $.http.get('/models?key=' + $.auth.data.apiKey);
    
    response.data.models
    let models = [];
    for (let model of response.data.models) {
      models.push({
        value: model.name,
        name: model.displayName,
      });
    }

    return {
      data: models,
    };
  },
};
