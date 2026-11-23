const setBaseUrl = ($, requestConfig) => {
  const apiBaseUrl = $.auth.data?.apiBaseUrl;

  if (apiBaseUrl) {
    requestConfig.baseURL = apiBaseUrl.replace(/\/+$/, '');
  }

  return requestConfig;
};

export default setBaseUrl;
