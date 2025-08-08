import { URL } from 'node:url';

const setBaseUrl = ($, requestConfig) => {
  const { apiDomain } = $.auth.data;

  if (apiDomain) {
    requestConfig.baseURL = new URL('api', apiDomain).toString();
  }

  return requestConfig;
};
export default setBaseUrl;
