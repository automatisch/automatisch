import { TBeforeRequest } from '@automatisch/types';

const setBaseUrl: TBeforeRequest = ($, requestConfig) => {
  if ($.auth.data.apiUrl) {
    requestConfig.baseURL = $.auth.data.apiUrl as string;
  }

  return requestConfig;
};

export default setBaseUrl;
