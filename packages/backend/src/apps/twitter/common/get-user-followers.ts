import {
  IGlobalVariable,
  IJSONObject,
  ITriggerOutput,
} from '@automatisch/types';
import { URLSearchParams } from 'url';
import { omitBy, isEmpty } from 'lodash';

type GetUserFollowersOptions = {
  userId: string;
};

const getUserFollowers = async (
  $: IGlobalVariable,
  options: GetUserFollowersOptions
) => {
  let response;

  const followers: ITriggerOutput = {
    data: [],
  };

  do {
    const params: IJSONObject = {
      pagination_token: response?.data?.meta?.next_token,
    };

    const queryParams = new URLSearchParams(omitBy(params, isEmpty));

    const requestPath = `/2/users/${options.userId}/followers${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = await $.http.get(requestPath);

    if (response.integrationError) {
      followers.error = response.integrationError;
      return followers;
    }

    if (response.data?.errors) {
      followers.error = response.data.errors;
      return followers;
    }

    if (response.data.meta.result_count > 0) {
      for (const follower of response.data.data) {
        if ($.flow.isAlreadyProcessed(follower.id as string)) {
          return followers;
        }

        followers.data.push({
          raw: follower,
          meta: { internalId: follower.id as string },
        });
      }
    }
  } while (response.data.meta.next_token && !$.execution.testRun);

  return followers;
};

export default getUserFollowers;
