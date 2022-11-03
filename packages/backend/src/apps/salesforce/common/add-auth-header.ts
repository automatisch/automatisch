import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const { instanceUrl, tokenType, accessToken } = $.auth.data;

  if (instanceUrl) {
    requestConfig.baseURL = instanceUrl as string;
  }

  if (tokenType && accessToken) {
    requestConfig.headers.Authorization = `${tokenType} ${accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
