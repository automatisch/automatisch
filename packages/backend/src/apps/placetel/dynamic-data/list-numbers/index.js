export default {
  name: 'List numbers',
  key: 'listNumbers',

  async run($) {
    const numbers = {
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
