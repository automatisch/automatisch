const setBaseUrl = ($, requestConfig) => {
  if ($.auth.data.instanceUrl) {
    requestConfig.baseURL = $.auth.data.instanceUrl + '/api';
  } else if ($.app.apiBaseUrl) {
    requestConfig.baseURL = $.app.apiBaseUrl + '/api';
  }

  return requestConfig;
};

export default setBaseUrl;
