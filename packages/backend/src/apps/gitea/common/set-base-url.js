const setBaseUrl = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingBaseUrl)
    return requestConfig;

  const instanceUrl = $.auth.data.instanceUrl;

  if (instanceUrl) {
    requestConfig.baseURL = `${instanceUrl}/api/v1`;
  }

  return requestConfig;
};

export default setBaseUrl;
