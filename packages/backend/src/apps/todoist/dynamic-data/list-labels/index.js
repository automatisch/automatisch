export default {
  name: 'List labels',
  key: 'listLabels',

  async run($) {
    const response = await $.http.get('/labels');

    response.data = response.data.map((label) => {
      return {
        value: label.name,
        name: label.name,
      };
    });

    return response;
  },
};
