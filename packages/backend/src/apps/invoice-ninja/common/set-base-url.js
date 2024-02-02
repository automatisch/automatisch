const setBaseUrl = ($, requestConfig) => {
  const instanceUrl = $.auth.data.instanceUrl;

  if (instanceUrl) {
    requestConfig.baseURL = instanceUrl;
  }

  return requestConfig;
};

export default setBaseUrl;
