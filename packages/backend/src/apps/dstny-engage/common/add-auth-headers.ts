import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if (requestConfig.headers && $.auth.data?.authToken) {
    requestConfig.headers['X-API-KEY'] = $.auth.data.authToken as string;
  }

  return requestConfig;
};

export default addAuthHeader;
