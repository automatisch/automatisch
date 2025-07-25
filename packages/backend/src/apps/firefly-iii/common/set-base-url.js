const setBaseUrl = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingBaseUrl) {
    requestConfig.baseURL = $.auth.data.instanceUrl;
    return requestConfig;
  }

  requestConfig.baseURL = $.auth.data.instanceUrl + '/api';

  return requestConfig;
};

export default setBaseUrl;
