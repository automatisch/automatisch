import { URL } from 'node:url';

const addAuthHeader = ($, requestConfig) => {
  const { instanceUrl, tokenType, accessToken } = $.auth.data;

  if (instanceUrl) {
    if (requestConfig.additionalProperties?.skipAddingBaseUrl) {
      requestConfig.baseURL = instanceUrl;
    } else {
      requestConfig.baseURL = new URL('api', instanceUrl).toString();
    }
  }

  if (tokenType && accessToken) {
    requestConfig.headers.Authorization = `${tokenType} ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
