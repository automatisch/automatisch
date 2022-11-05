import { IGlobalVariable } from '@automatisch/types';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo';
import paginateAll from '../../common/paginate-all';

export default {
  name: 'List labels',
  key: 'listLabels',

  async run($: IGlobalVariable) {
    const { repoOwner, repo } = getRepoOwnerAndRepo(
      $.step.parameters.repo as string
    );

    if (!repo) return { data: [] };

    const firstPageRequest = $.http.get(`/repos/${repoOwner}/${repo}/labels`);
    const response = await paginateAll($, firstPageRequest);

    response.data = response.data.map((repo: { name: string }) => {
      return {
        value: repo.name,
        name: repo.name,
      };
    });

    return response;
  },
};
