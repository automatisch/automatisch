import { DateTime } from 'luxon';
import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo';
import parseLinkHeader from '../../../../helpers/parse-header-link';

type TResponseDataItem = {
  starred_at: string;
  user: IJSONObject;
};

const newStargazers = async ($: IGlobalVariable) => {
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

  do {
    const response = await $.http.get<TResponseDataItem[]>(
      pathname,
      requestConfig
    );
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
