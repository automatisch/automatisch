const setBaseUrl = ($, requestConfig) => {
  requestConfig.baseURL = $.auth.data.instanceUrl + '/api';
  return requestConfig;
};

export default setBaseUrl;
