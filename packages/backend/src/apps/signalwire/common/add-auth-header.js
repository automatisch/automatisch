const addAuthHeader = ($, requestConfig) => {
  const authData = $.auth.data || {};

  requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';

  requestConfig.auth = {
    username: authData.accountSid,
    password: authData.authToken,
  };

  const serverUrl = `https://${authData.spaceName}.${authData.spaceRegion}signalwire.com/api`;

  requestConfig.baseURL = serverUrl;

  return requestConfig;
};

export default addAuthHeader;
