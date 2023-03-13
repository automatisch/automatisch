import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const authData = $.auth.data || {};

  requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';

  if (
    authData.accountSid &&
    authData.authToken
  ) {
    requestConfig.auth = {
      username: authData.accountSid as string,
      password: authData.authToken as string,
    };
  }

  if (authData.spaceName) {
    const serverUrl = `https://${authData.spaceName}.${authData.spaceRegion}signalwire.com`;

    requestConfig.baseURL = serverUrl as string;
  }

  return requestConfig;
};

export default addAuthHeader;
