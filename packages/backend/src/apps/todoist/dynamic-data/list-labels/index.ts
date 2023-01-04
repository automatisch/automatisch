import { IGlobalVariable } from '@automatisch/types';

export default {
  name: 'List labels',
  key: 'listLabels',

  async run($: IGlobalVariable) {
    const response = await $.http.get('/labels');

    response.data = response.data.map((label: { name: string }) => {
      return {
        value: label.name,
        name: label.name,
      };
    });

    return response;
  },
};
