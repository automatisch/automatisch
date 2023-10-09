import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List numbers',
  key: 'listNumbers',

  async run($: IGlobalVariable) {
    const numbers: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const { data } = await $.http.get('/v2/numbers');

    if (!data) {
      return { data: [] };
    }

    if (data.length) {
      for (const number of data) {
        numbers.data.push({
          value: number.number,
          name: number.number,
        });
      }
    }

    return numbers;
  },
};
