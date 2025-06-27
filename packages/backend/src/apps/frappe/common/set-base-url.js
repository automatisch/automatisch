const setBaseUrl = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingBaseUrl)
    return requestConfig;

  const siteUrl = $.auth.data?.site_url;

  if (siteUrl) {
    requestConfig.baseURL = `${siteUrl}/api/v2`;
  }

  return requestConfig;
};

export default setBaseUrl;
