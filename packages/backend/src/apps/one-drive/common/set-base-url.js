const setBaseUrl = ($, requestConfig) => {

  if (requestConfig.additionalProperties?.skipAddingBaseUrl)
    return requestConfig;

  const webUrl = $.auth.data.webUrl;
  if (webUrl) {
    requestConfig.baseURL = webUrl;
  }

  return requestConfig;
};

export default setBaseUrl;
