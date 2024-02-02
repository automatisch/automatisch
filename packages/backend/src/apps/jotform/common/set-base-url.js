const setBaseUrl = ($, requestConfig) => {
  if ($.auth.data.instanceUrl) {
    requestConfig.baseURL = $.auth.data.instanceUrl;
  } else if ($.app.apiBaseUrl) {
    requestConfig.baseURL = $.app.apiBaseUrl;
  }

  return requestConfig;
};

export default setBaseUrl;
