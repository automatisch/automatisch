import { TBeforeRequest } from '@automatisch/types';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const clientId = $.auth.data.clientId as string;
  let token;
  if (requestConfig.additionalProperties?.appAccessToken) {
    token = $.auth.data.appAccessToken;
  } else {
    token = $.auth.data.userAccessToken;
  }

  if (token && clientId) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
    requestConfig.headers['Client-Id'] = clientId;
  }

  return requestConfig;
};

export default addAuthHeader;
