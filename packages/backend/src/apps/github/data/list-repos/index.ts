import { IGlobalVariable } from '@automatisch/types';
import paginateAll from '../../common/paginate-all';

export default {
  name: 'List repos',
  key: 'listRepos',

  async run($: IGlobalVariable) {
    const firstPageRequest = $.http.get('/user/repos');
    const response = await paginateAll($, firstPageRequest);

    response.data = response.data.map((repo: { full_name: string }) => {
      return {
        value: repo.full_name,
        name: repo.full_name,
      };
    });

    return response;
  },
};
