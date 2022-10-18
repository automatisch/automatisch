import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if (requestConfig.headers && $.auth.data?.accessToken) {
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
