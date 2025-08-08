import { URL } from 'node:url';

const setBaseUrl = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingBaseUrl) {
    requestConfig.baseURL = $.auth.data.instanceUrl || $.app.apiBaseUrl;

    return requestConfig;
  }

  if ($.auth.data.instanceUrl) {
    requestConfig.baseURL = new URL('api', $.auth.data.instanceUrl).toString();
  } else if ($.app.apiBaseUrl) {
    requestConfig.baseURL = new URL('api', $.app.apiBaseUrl).toString();
  }

  return requestConfig;
};

export default setBaseUrl;
