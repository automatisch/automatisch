const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiKey && $.auth.data?.amaLicense) {
    requestConfig.headers['apikey'] = `${$.auth.data.apiKey}`;
    requestConfig.headers['amalicense'] = `${$.auth.data.amaLicense}`;
  }

  return requestConfig;
};

export default addAuthHeader;
