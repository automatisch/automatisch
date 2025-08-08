import { URL } from 'node:url';

const setBaseUrl = ($, requestConfig) => {
  requestConfig.baseURL = new URL('api', $.auth.data.instanceUrl).toString();
  return requestConfig;
};

export default setBaseUrl;
