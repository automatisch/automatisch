import qs from 'qs';
import omitBy from 'lodash/omitBy.js';
import isEmpty from 'lodash/isEmpty.js';

const searchTweets = async ($) => {
  const searchTerm = $.step.parameters.searchTerm;

  let response;

  do {
    const params = {
      query: searchTerm,
      since_id: $.flow.lastInternalId,
      pagination_token: response?.data?.meta?.next_token,
    };

    const queryParams = qs.stringify(omitBy(params, isEmpty));

    const requestPath = `/2/tweets/search/recent${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = await $.http.get(requestPath);

    if (response.data.errors) {
      throw new Error(JSON.stringify(response.data.errors));
    }

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
};

export default searchTweets;
