const setBaseUrl = ($, requestConfig) => {
  const webUrl = $.auth.data.webUrl;
  if (webUrl) {
    requestConfig.baseURL = webUrl;
  }

  return requestConfig;
};

export default setBaseUrl;
