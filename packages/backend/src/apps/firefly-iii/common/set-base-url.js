import { URL } from 'node:url';

const setBaseUrl = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingBaseUrl) {
    requestConfig.baseURL = $.auth.data.instanceUrl;
    return requestConfig;
  }

  requestConfig.baseURL = new URL('api', $.auth.data.instanceUrl).toString();

  return requestConfig;
};

export default setBaseUrl;
