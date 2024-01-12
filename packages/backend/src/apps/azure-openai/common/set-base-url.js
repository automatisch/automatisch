const setBaseUrl = ($, requestConfig) => {
  const yourResourceName = $.auth.data.yourResourceName;

  if (yourResourceName) {
    requestConfig.baseURL = `https://${yourResourceName}.openai.azure.com/openai`;
  }

  return requestConfig;
};

export default setBaseUrl;
