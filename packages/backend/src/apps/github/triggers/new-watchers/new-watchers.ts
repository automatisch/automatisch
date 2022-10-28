import { IGlobalVariable } from '@automatisch/types';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo';
import parseLinkHeader from '../../../../helpers/parse-header-link';

const newWatchers = async ($: IGlobalVariable) => {
  const repoParameter = $.step.parameters.repo as string;

  if (!repoParameter) throw new Error('A repo must be set!');

  const { repoOwner, repo } = getRepoOwnerAndRepo(repoParameter);

  const firstPagePathname = `/repos/${repoOwner}/${repo}/subscribers`;
  const requestConfig = {
    params: {
      per_page: 100,
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

      for (const watcher of response.data) {
        const watcherId = watcher.id.toString();

        const dataItem = {
          raw: watcher,
          meta: {
            internalId: watcherId,
          },
        };

        $.pushTriggerItem(dataItem);
      }
    }
  } while (pathname);
};

export default newWatchers;
