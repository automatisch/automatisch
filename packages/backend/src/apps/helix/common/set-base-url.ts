import { TBeforeRequest } from '@automatisch/types';

const setBaseUrl: TBeforeRequest = ($, requestConfig) => {
  if ($.auth.data.instanceUrl) {
    requestConfig.baseURL = $.auth.data.instanceUrl as string;
  } else if ($.app.apiBaseUrl) {
    requestConfig.baseURL = $.app.apiBaseUrl as string;
  }

  return requestConfig;
};

export default setBaseUrl;
