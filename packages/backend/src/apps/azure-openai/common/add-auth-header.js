const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiKey) {
    requestConfig.headers['api-key'] = $.auth.data.apiKey;
  }

  requestConfig.params = {
    'api-version': '2023-10-01-preview',
  };

  return requestConfig;
};

export default addAuthHeader;
