import {
  IGlobalVariable,
  IJSONObject,
  ITriggerOutput,
} from '@automatisch/types';
import qs from 'qs';
import { omitBy, isEmpty } from 'lodash';

const fetchTweets = async ($: IGlobalVariable) => {
  const searchTerm = $.step.parameters.searchTerm as string;

  let response;

  const tweets: ITriggerOutput = {
    data: [],
  };

  do {
    const params: IJSONObject = {
      query: searchTerm,
      since_id: $.execution.testRun ? null : $.flow.lastInternalId,
      pagination_token: response?.data?.meta?.next_token,
    };

    const queryParams = qs.stringify(omitBy(params, isEmpty));

    const requestPath = `/2/tweets/search/recent${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = await $.http.get(requestPath);

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

  return tweets;
};

const searchTweets = async ($: IGlobalVariable) => {
  const tweets = await fetchTweets($);

  tweets.data.sort((tweet, nextTweet) => {
    return Number(tweet.meta.internalId) - Number(nextTweet.meta.internalId);
  });

  return tweets;
};

export default searchTweets;
