const setBaseUrl = ($, requestConfig) => {
  const domain = $.auth.data.domain;
  if (domain) {
    requestConfig.baseURL = `https://${domain}.vtiger.com`;
  }

  return requestConfig;
};

export default setBaseUrl;
