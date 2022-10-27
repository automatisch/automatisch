import { IGlobalVariable } from '@automatisch/types';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo';
import parseLinkHeader from '../../../../helpers/parse-header-link';

const newPullRequests = async ($: IGlobalVariable) => {
  const repoParameter = $.step.parameters.repo as string;

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
