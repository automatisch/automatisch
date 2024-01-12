const addAuthHeader = ($, requestConfig) => {
  const { instanceUrl } = $.auth.data;

  if (instanceUrl) {
    requestConfig.baseURL = instanceUrl;
  }

  requestConfig.headers['X-API-TOKEN'] = $.auth.data.apiToken;

  requestConfig.headers['X-Requested-With'] = 'XMLHttpRequest';

  requestConfig.headers['Content-Type'] =
    requestConfig.headers['Content-Type'] || 'application/json';

  return requestConfig;
};

export default addAuthHeader;
