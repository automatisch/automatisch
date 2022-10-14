import {
  IGlobalVariable,
  IJSONObject,
  ITriggerOutput,
} from '@automatisch/types';
import qs from 'qs';
import generateRequest from '../../common/generate-request';
import { omitBy, isEmpty } from 'lodash';

type ISearchTweetsOptions = {
  searchTerm: string;
  lastInternalId?: string;
};

const searchTweets = async (
  $: IGlobalVariable,
  options: ISearchTweetsOptions
) => {
  let response;

  const tweets: ITriggerOutput = {
    data: [],
  };

  do {
    const params: IJSONObject = {
      query: options.searchTerm,
      since_id: options.lastInternalId,
      pagination_token: response?.data?.meta?.next_token,
    };

    const queryParams = qs.stringify(omitBy(params, isEmpty));

    const requestPath = `/2/tweets/search/recent${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = await generateRequest($, {
      requestPath,
      method: 'GET',
    });

    if (response.integrationError) {
      tweets.error = response.integrationError;
      return tweets;
    }

    if (response.data.errors) {
      tweets.error = response.data.errors;
      return tweets;
    }

    if (response.data.meta.result_count > 0) {
      response.data.data.forEach((tweet: IJSONObject) => {
        const dataItem = {
          raw: tweet,
          meta: {
            internalId: tweet.id as string,
          },
        };

        tweets.data.push(dataItem);
      });
    }
  } while (response.data.meta.next_token && !$.execution.testRun);

  tweets.data.sort((tweet, nextTweet) => {
    return (tweet.raw.id as number) - (nextTweet.raw.id as number);
  });

  return tweets;
};

export default searchTweets;
