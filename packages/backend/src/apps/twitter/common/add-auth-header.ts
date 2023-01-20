import { Token } from 'oauth-1.0a';
import { URLSearchParams } from 'node:url';
import { IJSONObject, TBeforeRequest } from '@automatisch/types';
import oauthClient from './oauth-client';

type RequestDataType = {
  url: string;
  method: string;
  data?: IJSONObject;
};

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const { baseURL, url, method, data, params } = requestConfig;

  const token: Token = {
    key: $.auth.data?.accessToken as string,
    secret: $.auth.data?.accessSecret as string,
  };

  const searchParams = new URLSearchParams(params);
  const stringifiedParams = searchParams.toString();
  let fullUrl = `${baseURL}${url}`;

  // append the search params
  if (stringifiedParams) {
    fullUrl = `${fullUrl}?${stringifiedParams}`;
  }

  const requestData: RequestDataType = {
    url: fullUrl,
    method,
  };

  if (url === '/oauth/request_token') {
    requestData.data = data;
  }

  const authHeader = oauthClient($).toHeader(
    oauthClient($).authorize(requestData, token)
  );

  requestConfig.headers.Authorization = authHeader.Authorization;

  return requestConfig;
};

export default addAuthHeader;
