import {IGlobalVariable, IJSONObject} from "@automatisch/types";
import {URLSearchParams} from "url";
import {isEmpty, omitBy} from "lodash";

const getBalanceTransactions = async ($: IGlobalVariable) => {
  let response;
  let lastId = undefined;

  do {
    const params: IJSONObject = {
      starting_after: lastId,
      ending_before: $.flow.lastInternalId
    }
    const queryParams = new URLSearchParams(omitBy(params, isEmpty))
    const requestPath = `/v1/balance_transactions${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = (await $.http.get(requestPath)).data
    for (const entry of response.data) {
      $.pushTriggerItem({
        raw: entry,
        meta: {
          internalId: entry.id as string
        }
      })
      lastId = entry.id
    }
  } while (response.has_more)
};

export default getBalanceTransactions;