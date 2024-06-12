export default {
  name: 'List surveys',
  key: 'listSurveys',

  async run($) {
    const surveys = {
      data: [],
    };

    const params = {
      page: 1,
      per_page: 100,
      sort_by: 'date_modified',
      sort_order: 'DESC',
    };

    let fetchedSum = 0;
    let total;
    do {
      const { data } = await $.http.get(`/v3/surveys`, { params });

      params.page = params.page + 1;
      fetchedSum = fetchedSum + params.per_page;
      total = data.total;

      if (data.data) {
        for (const survey of data.data) {
          surveys.data.push({
            value: survey.id,
            name: survey.title,
          });
        }
      }
    } while (fetchedSum <= total);

    return surveys;
  },
};
