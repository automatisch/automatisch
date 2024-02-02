import { URL } from 'node:url';

const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.token) {
    const token = $.auth.data.token;
    requestConfig.baseURL = new URL(
      `/bot${token}`,
      requestConfig.baseURL
    ).toString();
  }

  return requestConfig;
};

export default addAuthHeader;
