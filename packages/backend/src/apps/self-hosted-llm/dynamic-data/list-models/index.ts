import { IGlobalVariable } from '@automatisch/types';

export default {
  name: 'List models',
  key: 'listModels',

  async run($: IGlobalVariable) {
    const response = await $.http.get('/v1/models');

    const models = response.data.data.map((model: { id: string }) => {
      return {
        value: model.id,
        name: model.id,
      };
    });

    return { data: models };
  },
};
