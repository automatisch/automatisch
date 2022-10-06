import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import { URLSearchParams } from 'url';
import { omitBy, isEmpty } from 'lodash';
import generateRequest from './generate-request';

type GetUserFollowersOptions = {
  userId: string;
  lastInternalId?: string;
};

const getUserFollowers = async (
  $: IGlobalVariable,
  options: GetUserFollowersOptions
) => {
  let response;
  const followers: IJSONObject[] = [];

  do {
    const params: IJSONObject = {
      pagination_token: response?.data?.meta?.next_token,
    };

    const queryParams = new URLSearchParams(omitBy(params, isEmpty));

    const requestPath = `/2/users/${options.userId}/followers${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = await generateRequest($, {
      requestPath,
      method: 'GET',
    });

    if (response.data.meta.result_count > 0) {
      response.data.data.forEach((tweet: IJSONObject) => {
        if (
          !options.lastInternalId ||
          Number(tweet.id) > Number(options.lastInternalId)
        ) {
          followers.push(tweet);
        } else {
          return;
        }
      });
    }
  } while (response.data.meta.next_token && options.lastInternalId);

  if (response.data?.errors) {
    const errorMessages = response.data.errors
      .map((error: IJSONObject) => error.detail)
      .join(' ');

    throw new Error(`Error occured while fetching user data: ${errorMessages}`);
  }

  return followers;
};

export default getUserFollowers;
