import { URLSearchParams } from 'url';
import omitBy from 'lodash/omitBy.js';
import isEmpty from 'lodash/isEmpty.js';
import getCurrentUser from './get-current-user.js';
import getUserByUsername from './get-user-by-username.js';

const fetchTweets = async ($, username) => {
  const user = await getUserByUsername($, username);

  let response;

  do {
    const params = {
      since_id: $.flow.lastInternalId,
      pagination_token: response?.data?.meta?.next_token,
    };

    const queryParams = new URLSearchParams(omitBy(params, isEmpty));

    const requestPath = `/2/users/${user.id}/tweets${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = await $.http.get(requestPath);

    if (response.data.meta.result_count > 0) {
      response.data.data.forEach((tweet) => {
        const dataItem = {
          raw: tweet,
          meta: {
            internalId: tweet.id,
          },
        };

        $.pushTriggerItem(dataItem);
      });
    }
  } while (response.data.meta.next_token);

  return $.triggerOutput;
};

const getUserTweets = async ($, options) => {
  let username;

  if (options.currentUser) {
    const currentUser = await getCurrentUser($);
    username = currentUser.username;
  } else {
    username = $.step.parameters.username;
  }

  await fetchTweets($, username);
};

export default getUserTweets;
