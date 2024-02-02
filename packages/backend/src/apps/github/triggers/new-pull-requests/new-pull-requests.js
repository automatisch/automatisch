import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo.js';
import parseLinkHeader from '../../../../helpers/parse-header-link.js';

const newPullRequests = async ($) => {
  const repoParameter = $.step.parameters.repo;

  if (!repoParameter) throw new Error('A repo must be set!');

  const { repoOwner, repo } = getRepoOwnerAndRepo(repoParameter);

  const pathname = `/repos/${repoOwner}/${repo}/pulls`;
  const params = {
    state: 'all',
    sort: 'created',
    direction: 'desc',
    per_page: 100,
  };

  let links;
  do {
    const response = await $.http.get(pathname, { params });
    links = parseLinkHeader(response.headers.link);

    if (response.data.length) {
      for (const pullRequest of response.data) {
        const pullRequestId = pullRequest.id;

        const dataItem = {
          raw: pullRequest,
          meta: {
            internalId: pullRequestId.toString(),
          },
        };

        $.pushTriggerItem(dataItem);
      }
    }
  } while (links.next);
};

export default newPullRequests;
