import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import { URLSearchParams } from 'url';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import getCurrentUser from './get-current-user';
import getUserByUsername from './get-user-by-username';

type IGetUserTweetsOptions = {
  currentUser: boolean;
};

const fetchTweets = async ($: IGlobalVariable, username: string) => {
  const user = await getUserByUsername($, username);

  let response;

  do {
    const params: IJSONObject = {
      since_id: $.flow.lastInternalId,
      pagination_token: response?.data?.meta?.next_token,
    };

    const queryParams = new URLSearchParams(omitBy(params, isEmpty));

    const requestPath = `/2/users/${user.id}/tweets${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = await $.http.get(requestPath);

    if (response.data.meta.result_count > 0) {
      response.data.data.forEach((tweet: IJSONObject) => {
        const dataItem = {
          raw: tweet,
          meta: {
            internalId: tweet.id as string,
          },
        };

        $.pushTriggerItem(dataItem);
      });
    }
  } while (response.data.meta.next_token);

  return $.triggerOutput;
};

const getUserTweets = async (
  $: IGlobalVariable,
  options: IGetUserTweetsOptions
) => {
  let username: string;

  if (options.currentUser) {
    const currentUser = await getCurrentUser($);
    username = currentUser.username as string;
  } else {
    username = $.step.parameters.username as string;
  }

  await fetchTweets($, username);
};

export default getUserTweets;
