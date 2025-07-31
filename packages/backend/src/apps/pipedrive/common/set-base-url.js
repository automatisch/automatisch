const setBaseUrl = ($, requestConfig) => {
  const { apiDomain } = $.auth.data;

  if (apiDomain) {
    requestConfig.baseURL = apiDomain + '/api';
  }

  return requestConfig;
};
export default setBaseUrl;
