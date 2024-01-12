import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo.js';
import paginateAll from '../../common/paginate-all.js';

export default {
  name: 'List labels',
  key: 'listLabels',

  async run($) {
    const { repoOwner, repo } = getRepoOwnerAndRepo($.step.parameters.repo);

    if (!repo) return { data: [] };

    const firstPageRequest = $.http.get(`/repos/${repoOwner}/${repo}/labels`);
    const response = await paginateAll($, firstPageRequest);

    response.data = response.data.map((repo) => {
      return {
        value: repo.name,
        name: repo.name,
      };
    });

    return response;
  },
};
