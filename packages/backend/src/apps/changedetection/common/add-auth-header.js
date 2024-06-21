const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiKey) {
    requestConfig.headers['x-api-key'] = $.auth.data.apiKey;
  }

  return requestConfig;
};

export default addAuthHeader;
