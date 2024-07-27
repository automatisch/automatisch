const addAuthHeader = ($, requestConfig) => {
  console.log('requestConfig', requestConfig)
  if (requestConfig.additionalProperties?.skip) return requestConfig;

  if ($.auth.data.serverUrl) {
    requestConfig.baseURL = $.auth.data.serverUrl;
  }

  if ($.auth.data?.username && $.auth.data?.password) {
    requestConfig.auth = {
      username: $.auth.data.username,
      password: $.auth.data.password,
    };
  }

  return requestConfig;
};

export default addAuthHeader;
