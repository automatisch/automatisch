import { DateTime } from 'luxon';
import {
  IGlobalVariable,
  IJSONObject,
  ITriggerOutput,
} from '@automatisch/types';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo';
import parseLinkHeader from '../../../../helpers/parse-header-link';

type TResponseDataItem = {
  starred_at: string;
  user: IJSONObject;
};

const fetchStargazers = async ($: IGlobalVariable) => {
  const { repoOwner, repo } = getRepoOwnerAndRepo(
    $.step.parameters.repo as string
  );
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

  const firstPageResponse = await $.http.get<TResponseDataItem[]>(
    firstPagePathname,
    requestConfig
  );
  const firstPageLinks = parseLinkHeader(firstPageResponse.headers.link);

  // in case there is only single page to fetch
  let pathname = firstPageLinks.last?.uri || firstPagePathname;

  const stargazers: ITriggerOutput = {
    data: [],
  };

  do {
    const response = await $.http.get<TResponseDataItem[]>(
      pathname,
      requestConfig
    );
    const links = parseLinkHeader(response.headers.link);
    pathname = links.prev?.uri;

    if (response.httpError) {
      stargazers.error = response.httpError;
      return stargazers;
    }

    if (response.data.length) {
      for (const starEntry of response.data) {
        const { starred_at, user } = starEntry;
        const timestamp = DateTime.fromISO(starred_at).toMillis();

        if (timestamp <= Number($.flow.lastInternalId) && !$.execution.testRun)
          return stargazers;

        const dataItem = {
          raw: user,
          meta: {
            internalId: timestamp.toString(),
          },
        };

        stargazers.data.push(dataItem);
      }
    }
  } while (pathname && !$.execution.testRun);

  return stargazers;
};

const newStargazers = async ($: IGlobalVariable) => {
  const stargazers = await fetchStargazers($);

  stargazers.data.sort((stargazerA, stargazerB) => {
    return (
      Number(stargazerA.meta.internalId) - Number(stargazerB.meta.internalId)
    );
  });

  return stargazers;
};

export default newStargazers;
