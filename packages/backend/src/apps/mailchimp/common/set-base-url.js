const setBaseUrl = ($, requestConfig) => {
  const serverPrefix = $.auth.data.serverPrefix;
  if (!requestConfig.additionalProperties?.skipAddingBaseUrl && serverPrefix) {
    requestConfig.baseURL = `https://${serverPrefix}.api.mailchimp.com`;
  }

  return requestConfig;
};

export default setBaseUrl;
