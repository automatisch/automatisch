import { Token } from 'oauth-1.0a';
import { IJSONObject, TBeforeRequest } from '@automatisch/types';
import oauthClient from './oauth-client';

type RequestDataType = {
  url: string;
  method: string;
  data?: IJSONObject;
};

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const { url, method, data, params } = requestConfig;

  const token: Token = {
    key: $.auth.data?.accessToken as string,
    secret: $.auth.data?.accessSecret as string,
  };

  const requestData: RequestDataType = {
    url: `${requestConfig.baseURL}${url}`,
    method,
  };

  if (url === '/oauth/request_token') {
    requestData.data = data;
  }

  if (method === 'get') {
    requestData.data = params;
  }

  const authHeader = oauthClient($).toHeader(
    oauthClient($).authorize(requestData, token)
  );

  requestConfig.headers.Authorization = authHeader.Authorization;

  return requestConfig;
};

export default addAuthHeader;
