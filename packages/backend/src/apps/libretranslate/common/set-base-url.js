const setBaseUrl = ($, requestConfig) => {
  const instanceUrl = $.auth.data.instanceUrl;
  const apiKey = $.auth.data.apiKey;

  if (instanceUrl) {
    requestConfig.baseURL = instanceUrl;
  } else if ($.app.apiBaseUrl) {
    requestConfig.baseURL = $.app.apiBaseUrl;
  }

  requestConfig.data = { api_key: apiKey, ...(requestConfig.data || {}) };

  return requestConfig;
};

export default setBaseUrl;
