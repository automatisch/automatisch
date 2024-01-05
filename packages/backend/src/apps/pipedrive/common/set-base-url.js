const setBaseUrl = ($, requestConfig) => {
  const { apiDomain } = $.auth.data;

  if (apiDomain) {
    requestConfig.baseURL = apiDomain;
  }

  return requestConfig;
};
export default setBaseUrl;
