const addAuthHeader = ($, requestConfig) => {
  requestConfig.headers['Content-Type'] = 'application/json';

  if ($.auth.data?.apiKey && $.auth.data?.projectId) {
    requestConfig.headers['X-Appwrite-Project'] = $.auth.data.projectId;
    requestConfig.headers['X-Appwrite-Key'] = $.auth.data.apiKey;
  }

  if ($.auth.data?.host) {
    requestConfig.headers['Host'] = $.auth.data.host;
  }

  return requestConfig;
};

export default addAuthHeader;
