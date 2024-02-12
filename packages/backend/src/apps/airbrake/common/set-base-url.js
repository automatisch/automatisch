const setBaseUrl = ($, requestConfig) => {
  const subdomain = $.auth.data.instanceUrl;

  if (subdomain) {
    requestConfig.baseURL = `https://${subdomain}.airbrake.io`;
  }

  return requestConfig;
};

export default setBaseUrl;
