const setBaseUrl = ($, requestConfig) => {
  const instanceUrl = $.auth.data.instanceUrl;
  if (instanceUrl) {
    requestConfig.baseURL = `${instanceUrl}/ghost/api`;
  }

  return requestConfig;
};

export default setBaseUrl;
