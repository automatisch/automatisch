import { IGlobalVariableForConnection, IJSONObject } from '@automatisch/types';
import { URLSearchParams } from 'url';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import generateRequest from './generate-request';

const getUserTweets = async (
  $: IGlobalVariableForConnection,
  userId: string,
  lastInternalId?: string
) => {
  let response;
  const tweets: IJSONObject[] = [];

  do {
    const params: IJSONObject = {
      since_id: lastInternalId,
      pagination_token: response?.data?.meta?.next_token,
    };

    const queryParams = new URLSearchParams(omitBy(params, isEmpty));

    const requestPath = `/2/users/${userId}/tweets${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = await generateRequest($, {
      requestPath,
      method: 'GET',
    });

    if (response.data.meta.result_count > 0) {
      response.data.data.forEach((tweet: IJSONObject) => {
        if (!lastInternalId || Number(tweet.id) > Number(lastInternalId)) {
          tweets.push(tweet);
        } else {
          return;
        }
      });
    }
  } while (response.data.meta.next_token && lastInternalId);

  if (response.data.errors) {
    const errorMessages = response.data.errors
      .map((error: IJSONObject) => error.detail)
      .join(' ');

    throw new Error(`Error occured while fetching user data: ${errorMessages}`);
  }

  return tweets;
};

export default getUserTweets;
