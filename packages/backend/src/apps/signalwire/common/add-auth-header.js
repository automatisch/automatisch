const addAuthHeader = ($, requestConfig) => {
  const authData = $.auth.data || {};

  requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';

  if (authData.accountSid && authData.authToken) {
    requestConfig.auth = {
      username: authData.accountSid,
      password: authData.authToken,
    };
  }

  if (authData.spaceName) {
    const serverUrl = `https://${authData.spaceName}.${authData.spaceRegion}signalwire.com`;

    requestConfig.baseURL = serverUrl;
  }

  return requestConfig;
};

export default addAuthHeader;
