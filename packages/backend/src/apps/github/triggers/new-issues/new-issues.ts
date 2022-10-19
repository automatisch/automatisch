import {
  IGlobalVariable,
  ITriggerOutput,
} from '@automatisch/types';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo';
import parseLinkHeader from '../../../../helpers/parse-header-link';

function getPathname($: IGlobalVariable) {
  const { repoOwner, repo } = getRepoOwnerAndRepo($.step.parameters.repo as string);

  if (repoOwner && repo) {
    return `/repos/${repoOwner}/${repo}/issues`;
  }

  return '/issues';
}

const newIssues = async ($: IGlobalVariable) => {
  const pathname = getPathname($);
  const params = {
    labels: $.step.parameters.label,
    filter: 'all',
    state: 'all',
    sort: 'created',
    direction: 'desc',
    per_page: 100,
  };

  const issues: ITriggerOutput = {
    data: [],
  };

  let links;
  do {
    const response = await $.http.get(pathname, { params });
    links = parseLinkHeader(response.headers.link);

    if (response.integrationError) {
      issues.error = response.integrationError;
      return issues;
    }

    if (response.data.length) {
      for (const issue of response.data) {
        const issueId = issue.id.toString();

        if (issueId <= $.flow.lastInternalId && !$.execution.testRun) return issues;

        const dataItem = {
          raw: issue,
          meta: {
            internalId: issueId,
          },
        };

        issues.data.push(dataItem);
      }
    }
  } while (links.next && !$.execution.testRun);

  return issues;
};

export default newIssues;
