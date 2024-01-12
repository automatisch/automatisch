const addAuthHeader = ($, requestConfig) => {
  const { instanceUrl, tokenType, accessToken } = $.auth.data;

  if (instanceUrl) {
    requestConfig.baseURL = instanceUrl;
  }

  if (tokenType && accessToken) {
    requestConfig.headers.Authorization = `${tokenType} ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
