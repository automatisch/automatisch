import { IGlobalVariable, IJSONObject } from '@automatisch/types';
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

  const tweets: {
    data: IJSONObject[];
    error: IJSONObject | null;
  } = {
    data: [],
    error: null,
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
        if (
          !options.lastInternalId ||
          Number(tweet.id) > Number(options.lastInternalId)
        ) {
          tweets.data.push(tweet);
        } else {
          return;
        }
      });
    }
  } while (response.data.meta.next_token && options.lastInternalId);

  return tweets;
};

export default searchTweets;
