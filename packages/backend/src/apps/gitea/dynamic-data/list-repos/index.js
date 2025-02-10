export default {
  name: 'List repos',
  key: 'listRepos',

  async run($) {
    const repos = {
      data: [],
    };

    const params = {
      page: 1,
      limit: 100,
    };

    let totalCount;
    let totalRequestedCount;
    do {
      const { data, headers } = await $.http.get('/user/repos', { params });
      params.page = params.page + 1;
      totalCount = Number(headers['x-total-count']);
      totalRequestedCount = params.page * params.limit;

      if (data?.length) {
        for (const repo of data) {
          repos.data.push({
            value: repo.name,
            name: repo.name,
          });
        }
      }
    } while (totalRequestedCount <= totalCount);

    return repos;
  },
};
