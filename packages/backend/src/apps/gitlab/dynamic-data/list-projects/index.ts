import { IGlobalVariable } from '@automatisch/types';
import paginateAll from '../../common/paginate-all';

export default {
  name: 'List projects',
  key: 'listProjects',

  async run($: IGlobalVariable) {
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

    response.data = response.data.map((repo: { name: string; id: number }) => {
      return {
        value: repo.id,
        name: repo.name,
      };
    });

    return response;
  },
};
