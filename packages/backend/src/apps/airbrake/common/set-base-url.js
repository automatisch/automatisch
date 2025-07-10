const setBaseUrl = ($, requestConfig) => {
  requestConfig.baseURL = $.auth.data.instanceUrl;

  return requestConfig;
};

export default setBaseUrl;
