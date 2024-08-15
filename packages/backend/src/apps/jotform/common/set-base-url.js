const setBaseUrl = ($, requestConfig) => {
  if ($.auth.data.apiUrl) {
    requestConfig.baseURL = $.auth.data.apiUrl;
  } else if ($.app.apiBaseUrl) {
    requestConfig.baseURL = $.app.apiBaseUrl;
  }

  return requestConfig;
};

export default setBaseUrl;
