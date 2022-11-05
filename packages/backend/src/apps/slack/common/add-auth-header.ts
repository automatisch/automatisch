import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const authData = $.auth.data;
  if (
    requestConfig.headers &&
    authData?.userAccessToken &&
    authData?.botAccessToken
  ) {
    if (requestConfig.additionalProperties?.sendAsBot) {
      requestConfig.headers.Authorization = `Bearer ${authData.botAccessToken}`;
    } else {
      requestConfig.headers.Authorization = `Bearer ${authData.userAccessToken}`;
    }
  }

  requestConfig.headers['Content-Type'] =
    requestConfig.headers['Content-Type'] || 'application/json; charset=utf-8';

  return requestConfig;
};

export default addAuthHeader;
