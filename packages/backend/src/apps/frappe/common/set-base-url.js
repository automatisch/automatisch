import { URL } from 'node:url';

const setBaseUrl = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingBaseUrl)
    return requestConfig;

  requestConfig.baseURL = new URL('/api', $.auth.data.site_url).toString();

  return requestConfig;
};

export default setBaseUrl;
