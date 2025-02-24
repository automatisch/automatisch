import oauthClient from './oauth-client.js';
import appConfig from '../../../config/app.js';

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
  const screenName = $.auth.data?.screenName;
  if (screenName) {
    requestConfig.headers[
      'User-Agent'
    ] = `web:automatisch:${appConfig.version} (by ${screenName})`;
  } else {
    requestConfig.headers[
      'User-Agent'
    ] = `web:automatisch:${appConfig.version}`;
  }

  return requestConfig;
};

export default addAuthHeader;
