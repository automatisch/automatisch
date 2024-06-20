export default {
  name: 'List stages',
  key: 'listStages',

  async run($) {
    const stages = {
      data: [],
    };

    const { data } = await $.http.get('/api/v1/stages');

    if (data.data?.length) {
      for (const stage of data.data) {
        stages.data.push({
          value: stage.id,
          name: stage.name,
        });
      }
    }

    return stages;
  },
};
