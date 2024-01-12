import oauthClient from './oauth-client.js';

const addAuthHeader = ($, requestConfig) => {
  const { url, method, data, params } = requestConfig;

  const token = {
    key: $.auth.data?.accessToken,
    secret: $.auth.data?.accessSecret,
  };

  const requestData = {
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
