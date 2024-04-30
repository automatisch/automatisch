export default {
  name: 'List labels',
  key: 'listLabels',

  async run($) {
    const labels = {
      data: [],
    };
    const repoOwner = $.auth.data.repoOwner;
    const repo = $.step.parameters.repo;

    const params = {
      page: 1,
      limit: 100,
    };

    let totalCount;
    let totalRequestedCount;
    do {
      const { data, headers } = await $.http.get(
        `/repos/${repoOwner}/${repo}/labels`,
        { params }
      );
      params.page = params.page + 1;
      totalCount = Number(headers['x-total-count']);
      totalRequestedCount = params.page * params.limit;

      if (data?.length) {
        for (const label of data) {
          labels.data.push({
            value: label.name,
            name: label.name,
          });
        }
      }
    } while (totalRequestedCount <= totalCount);

    return labels;
  },
};
