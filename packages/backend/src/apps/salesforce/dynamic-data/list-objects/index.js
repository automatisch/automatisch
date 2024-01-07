export default {
  name: 'List objects',
  key: 'listObjects',

  async run($) {
    const response = await $.http.get('/services/data/v56.0/sobjects');

    const objects = response.data.sobjects.map((object) => {
      return {
        value: object.name,
        name: object.label,
      };
    });

    return { data: objects };
  },
};
