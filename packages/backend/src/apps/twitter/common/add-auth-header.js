import { URLSearchParams } from 'node:url';
import oauthClient from './oauth-client.js';

const addAuthHeader = ($, requestConfig) => {
  const { baseURL, url, method, data, params } = requestConfig;

  const token = {
    key: $.auth.data?.accessToken,
    secret: $.auth.data?.accessSecret,
  };

  const searchParams = new URLSearchParams(params);
  const stringifiedParams = searchParams.toString();
  let fullUrl = `${baseURL}${url}`;

  // append the search params
  if (stringifiedParams) {
    fullUrl = `${fullUrl}?${stringifiedParams}`;
  }

  const requestData = {
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
