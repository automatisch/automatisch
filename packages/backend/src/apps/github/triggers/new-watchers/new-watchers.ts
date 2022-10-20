import {
  IGlobalVariable,
  ITriggerOutput,
} from '@automatisch/types';
import getRepoOwnerAndRepo from '../../common/get-repo-owner-and-repo';
import parseLinkHeader from '../../../../helpers/parse-header-link';

const fetchWatchers = async ($: IGlobalVariable) => {
  const repoParameter = $.step.parameters.repo as string;

  if (!repoParameter) throw new Error('A repo must be set!');

  const { repoOwner, repo } = getRepoOwnerAndRepo(repoParameter);

  const firstPagePathname = `/repos/${repoOwner}/${repo}/subscribers`;
  const requestConfig = {
    params: {
      per_page: 100
    },
  }

  const firstPageResponse = await $.http.get(firstPagePathname, requestConfig);
  const firstPageLinks = parseLinkHeader(firstPageResponse.headers.link);

  // in case there is only single page to fetch
  let pathname = firstPageLinks.last?.uri || firstPagePathname;

  const watchers: ITriggerOutput = {
    data: [],
  };

  do {
    const response = await $.http.get(pathname, requestConfig);
    const links = parseLinkHeader(response.headers.link);
    pathname = links.prev?.uri;

    if (response.integrationError) {
      watchers.error = response.integrationError;
      return watchers;
    }

    if (response.data.length) {
      // to iterate reverse-chronologically
      response.data.reverse();

      for (const watcher of response.data) {
        const watcherId = watcher.id.toString();

        if ($.flow.isAlreadyProcessed(watcherId) && !$.execution.testRun) return watchers;

        const dataItem = {
          raw: watcher,
          meta: {
            internalId: watcherId,
          },
        };

        watchers.data.push(dataItem);
      }
    }
  } while (pathname && !$.execution.testRun === false);

  return watchers;
}

const newWatchers = async ($: IGlobalVariable) => {
  const watchers = await fetchWatchers($);

  // to process chronologically
  watchers.data.reverse();

  return watchers;
};

export default newWatchers;
