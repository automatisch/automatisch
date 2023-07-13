import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if ($.auth.data?.accessToken) {
    requestConfig.headers = requestConfig.headers || {};
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
