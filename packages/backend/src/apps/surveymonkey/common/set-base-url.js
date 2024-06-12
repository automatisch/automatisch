const setBaseUrl = ($, requestConfig) => {
  const accessUrl = $.auth.data.accessUrl;

  if (accessUrl) {
    requestConfig.baseURL = accessUrl;
  }

  return requestConfig;
};

export default setBaseUrl;
