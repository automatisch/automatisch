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

  const followers: {
    data: IJSONObject[];
    error: IJSONObject | null;
  } = {
    data: [],
    error: null,
  };

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

    if (response.integrationError) {
      followers.error = response.integrationError;
      return followers;
    }

    if (response.data?.errors) {
      followers.error = response.data.errors;
      return followers;
    }

    if (response.data.meta.result_count > 0) {
      response.data.data.forEach((tweet: IJSONObject) => {
        if (
          !options.lastInternalId ||
          Number(tweet.id) > Number(options.lastInternalId)
        ) {
          followers.data.push(tweet);
        } else {
          return;
        }
      });
    }
  } while (response.data.meta.next_token && options.lastInternalId);

  return followers;
};

export default getUserFollowers;
