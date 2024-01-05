import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo.js';
import parseLinkHeader from '../../../../helpers/parse-header-link.js';

function getPathname($) {
  const { repoOwner, repo } = getRepoOwnerAndRepo($.step.parameters.repo);

  if (repoOwner && repo) {
    return `/repos/${repoOwner}/${repo}/issues`;
  }

  return '/issues';
}

const newIssues = async ($) => {
  const pathname = getPathname($);
  const params = {
    labels: $.step.parameters.label,
    filter: 'all',
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
      for (const issue of response.data) {
        const issueId = issue.id;

        const dataItem = {
          raw: issue,
          meta: {
            internalId: issueId.toString(),
          },
        };

        $.pushTriggerItem(dataItem);
      }
    }
  } while (links.next);
};

export default newIssues;
