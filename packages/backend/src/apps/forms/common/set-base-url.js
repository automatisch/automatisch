const setBaseUrl = ($, requestConfig) => {
  const instanceUrl = $.auth.data.instanceUrl;

  if (instanceUrl) {
    requestConfig.baseURL = instanceUrl;
  } else if ($.app.apiBaseUrl) {
    requestConfig.baseURL = $.app.apiBaseUrl;
  }

  return requestConfig;
};

export default setBaseUrl;
