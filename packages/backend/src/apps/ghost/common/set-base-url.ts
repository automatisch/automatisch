import { TBeforeRequest } from '@automatisch/types';

const setBaseUrl: TBeforeRequest = ($, requestConfig) => {
  const instanceUrl = $.auth.data.instanceUrl as string;
  if (instanceUrl) {
    requestConfig.baseURL = `${instanceUrl}/ghost/api`;
  }

  return requestConfig;
};

export default setBaseUrl;
