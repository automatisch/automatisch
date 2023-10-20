import { TBeforeRequest } from '@automatisch/types';

const setBaseUrl: TBeforeRequest = ($, requestConfig) => {
  const { apiDomain } = $.auth.data;

  if (apiDomain) {
    requestConfig.baseURL = apiDomain as string;
  }

  return requestConfig;
};
export default setBaseUrl;
