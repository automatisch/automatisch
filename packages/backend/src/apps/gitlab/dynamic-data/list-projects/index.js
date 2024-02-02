import paginateAll from '../../common/paginate-all.js';

export default {
  name: 'List projects',
  key: 'listProjects',

  async run($) {
    // ref:
    //  - https://docs.gitlab.com/ee/api/projects.html#list-all-projects
    //  - https://docs.gitlab.com/ee/api/rest/index.html#keyset-based-pagination
    const firstPageRequest = $.http.get('/api/v4/projects', {
      params: {
        simple: true,
        pagination: 'keyset',
        membership: true,
        order_by: 'id',
        sort: 'asc',
      },
    });

    const response = await paginateAll($, firstPageRequest);

    response.data = response.data.map((repo) => {
      return {
        value: repo.id,
        name: repo.name,
      };
    });

    return response;
  },
};
