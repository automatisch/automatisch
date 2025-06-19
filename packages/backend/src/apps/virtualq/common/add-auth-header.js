const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiKey) {
    requestConfig.headers['X-API-Key'] = $.auth.data.apiKey;
  }

  if (requestConfig.method === 'post' || requestConfig.method === 'put') {
    requestConfig.headers['Content-Type'] = 'application/vnd.api+json';
  }

  requestConfig.headers['X-Keys-Format'] = 'underscore';

  return requestConfig;
};

export default addAuthHeader;
