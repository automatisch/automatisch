const addApiKey = ($, requestConfig) => {
  if (!requestConfig.params) {
    requestConfig.params = {};
  }

  requestConfig.params.key = $.auth.data.authToken;

  return requestConfig;
};

export default addApiKey;
