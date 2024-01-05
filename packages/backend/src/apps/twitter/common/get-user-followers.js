import { URLSearchParams } from 'url';
import omitBy from 'lodash/omitBy.js';
import isEmpty from 'lodash/isEmpty.js';

const getUserFollowers = async ($, options) => {
  let response;

  do {
    const params = {
      pagination_token: response?.data?.meta?.next_token,
    };

    const queryParams = new URLSearchParams(omitBy(params, isEmpty));

    const requestPath = `/2/users/${options.userId}/followers${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = await $.http.get(requestPath);

    if (response.data?.errors) {
      throw new Error(response.data.errors);
    }

    if (response.data.meta.result_count > 0) {
      for (const follower of response.data.data) {
        $.pushTriggerItem({
          raw: follower,
          meta: { internalId: follower.id },
        });
      }
    }
  } while (response.data.meta.next_token);
};

export default getUserFollowers;
