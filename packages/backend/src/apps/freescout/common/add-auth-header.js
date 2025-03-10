const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiKey) {
    requestConfig.headers['X-FreeScout-API-Key'] = $.auth.data.apiKey;
  }

  return requestConfig;
};

export default addAuthHeader;
