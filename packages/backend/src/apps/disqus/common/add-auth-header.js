import { URLSearchParams } from 'url';

const addAuthHeader = ($, requestConfig) => {
  const params = new URLSearchParams({
    access_token: $.auth.data.accessToken,
    api_key: $.auth.data.apiKey,
    api_secret: $.auth.data.apiSecret,
  });

  requestConfig.params = params;

  return requestConfig;
};

export default addAuthHeader;
