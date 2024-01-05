import { URLSearchParams } from 'url';
import isEmpty from 'lodash/isEmpty.js';
import omitBy from 'lodash/omitBy.js';

const getPayouts = async ($) => {
  let response;
  let lastId = undefined;

  do {
    const params = {
      starting_after: lastId,
      ending_before: $.flow.lastInternalId,
    };
    const queryParams = new URLSearchParams(omitBy(params, isEmpty));
    const requestPath = `/v1/payouts${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = (await $.http.get(requestPath)).data;
    for (const entry of response.data) {
      $.pushTriggerItem({
        raw: entry,
        meta: {
          internalId: entry.id,
        },
      });
      lastId = entry.id;
    }
  } while (response.has_more);
};

export default getPayouts;
