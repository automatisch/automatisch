import {TBeforeRequest} from "@automatisch/types";

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  requestConfig.headers['Authorization'] = `Bearer ${$.auth.data?.secretKey}`
  return requestConfig
}

export default addAuthHeader;