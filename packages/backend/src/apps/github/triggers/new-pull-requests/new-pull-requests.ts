import {
  IGlobalVariable,
  ITriggerOutput,
} from '@automatisch/types';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo';
import parseLinkHeader from '../../../../helpers/parse-header-link';

const fetchPullRequests = async ($: IGlobalVariable) => {
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

  const pullRequests: ITriggerOutput = {
    data: [],
  };

  let links;
  do {
    const response = await $.http.get(pathname, { params });
    links = parseLinkHeader(response.headers.link);

    if (response.integrationError) {
      pullRequests.error = response.integrationError;
      return pullRequests;
    }

    if (response.data.length) {
      for (const pullRequest of response.data) {
        const pullRequestId = pullRequest.id;

        if (pullRequestId <= Number($.flow.lastInternalId) && !$.execution.testRun) return pullRequests;

        const dataItem = {
          raw: pullRequest,
          meta: {
            internalId: pullRequestId.toString(),
          },
        };

        pullRequests.data.push(dataItem);
      }
    }
  } while (links.next && !$.execution.testRun);

  return pullRequests;
}

const newPullRequests = async ($: IGlobalVariable) => {
  const pullRequests = await fetchPullRequests($);

  pullRequests.data.reverse();

  return pullRequests;
};

export default newPullRequests;
