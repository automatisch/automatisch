import { DateTime } from 'luxon';

import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo.js';
import parseLinkHeader from '../../../../helpers/parse-header-link.js';

const newStargazers = async ($) => {
  const { repoOwner, repo } = getRepoOwnerAndRepo($.step.parameters.repo);
  const firstPagePathname = `/repos/${repoOwner}/${repo}/stargazers`;
  const requestConfig = {
    params: {
      per_page: 100,
    },
    headers: {
      // needed to get `starred_at` time
      Accept: 'application/vnd.github.star+json',
    },
  };

  const firstPageResponse = await $.http.get(firstPagePathname, requestConfig);
  const firstPageLinks = parseLinkHeader(firstPageResponse.headers.link);

  // in case there is only single page to fetch
  let pathname = firstPageLinks.last?.uri || firstPagePathname;

  do {
    const response = await $.http.get(pathname, requestConfig);
    const links = parseLinkHeader(response.headers.link);
    pathname = links.prev?.uri;

    if (response.data.length) {
      // to iterate reverse-chronologically
      response.data.reverse();

      for (const starEntry of response.data) {
        const { starred_at, user } = starEntry;
        const timestamp = DateTime.fromISO(starred_at).toMillis();

        const dataItem = {
          raw: user,
          meta: {
            internalId: timestamp.toString(),
          },
        };

        $.pushTriggerItem(dataItem);
      }
    }
  } while (pathname);
};

export default newStargazers;
