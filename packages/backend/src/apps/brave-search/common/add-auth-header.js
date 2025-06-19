const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiKey) {
    requestConfig.headers['X-Subscription-Token'] = $.auth.data.apiKey;
  }

  return requestConfig;
};

export default addAuthHeader;
