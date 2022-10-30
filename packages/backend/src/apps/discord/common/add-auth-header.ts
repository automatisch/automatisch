import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const { tokenType, accessToken } = $.auth.data;
  if (tokenType && accessToken) {
    requestConfig.headers.Authorization = `${tokenType} ${accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
