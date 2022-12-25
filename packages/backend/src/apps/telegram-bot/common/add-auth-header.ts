import { TBeforeRequest } from '@automatisch/types';
import { URL } from 'node:url';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  if ($.auth.data?.token) {
    const token = $.auth.data.token as string;
    requestConfig.baseURL = (new URL(`/bot${token}`, requestConfig.baseURL)).toString();
  }

  return requestConfig;
};

export default addAuthHeader;
