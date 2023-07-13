import { TBeforeRequest } from '@automatisch/types';

const setBaseUrl: TBeforeRequest = ($, requestConfig) => {
  requestConfig.baseURL = $.auth.data.instanceUrl as string;

  return requestConfig;
};

export default setBaseUrl;
