const setBaseUrl = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingBaseUrl)
    return requestConfig;

  const apiDomain = $.auth.data.apiDomain;

  if (apiDomain) {
    requestConfig.baseURL = apiDomain;
  }

  return requestConfig;
};

export default setBaseUrl;
