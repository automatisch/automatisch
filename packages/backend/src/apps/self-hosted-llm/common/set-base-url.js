const setBaseUrl = ($, requestConfig) => {
  if ($.auth.data.apiUrl) {
    requestConfig.baseURL = $.auth.data.apiUrl;
  }

  return requestConfig;
};

export default setBaseUrl;
