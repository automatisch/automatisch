import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if ($.auth.data?.apiKey) {
    requestConfig.headers['X-API-Key'] = `${$.auth.data.apiKey}`;
  }

  return requestConfig;
};

export default addAuthHeader;