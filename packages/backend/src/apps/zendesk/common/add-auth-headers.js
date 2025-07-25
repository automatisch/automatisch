const addAuthHeader = ($, requestConfig) => {
  const { instanceUrl, tokenType, accessToken } = $.auth.data;

  if (instanceUrl) {
    if (requestConfig.additionalProperties?.skipAddingBaseUrl) {
      requestConfig.baseURL = instanceUrl;
    } else {
      requestConfig.baseURL = instanceUrl + '/api';
    }
  }

  if (tokenType && accessToken) {
    requestConfig.headers.Authorization = `${tokenType} ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
