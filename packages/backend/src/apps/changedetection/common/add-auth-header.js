const addAuthHeader = ($, requestConfig) => {
  requestConfig.headers['x-api-key'] = $.auth.data.apiKey;

  return requestConfig;
};

export default addAuthHeader;
