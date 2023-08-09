import { TBeforeRequest } from '@automatisch/types';

const setBaseUrl: TBeforeRequest = ($, requestConfig) => {
  const instanceUrl = $.auth.data.instanceUrl as string;
  if (instanceUrl) {
    requestConfig.baseURL = instanceUrl;
  }

  return requestConfig;
};

export default setBaseUrl;
