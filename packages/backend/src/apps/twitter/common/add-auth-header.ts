import { Token } from 'oauth-1.0a';
import { TBeforeRequest } from '@automatisch/types';
import oauthClient from './oauth-client';

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const { url, method, data } = requestConfig;

  const token: Token = {
    key: $.auth.data?.accessToken as string,
    secret: $.auth.data?.accessSecret as string,
  };

  const requestData = {
    url: `${requestConfig.baseURL}${url}`,
    method,
    data,
  };

  const authHeader = oauthClient($).toHeader(
    oauthClient($).authorize(requestData, token)
  );

  requestConfig.headers.Authorization = authHeader.Authorization;

  return requestConfig;
};

export default addAuthHeader;
