import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if ($.auth.data.oInstanceUrl) {
    requestConfig.baseURL = $.auth.data.oInstanceUrl as string;
  }

  if (requestConfig.headers && $.auth.data?.accessToken) {
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.accessToken}`;
  }
  return requestConfig;
};

export default addAuthHeader;
