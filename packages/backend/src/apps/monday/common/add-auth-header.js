const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiToken) {
    requestConfig.headers.Authorization = $.auth.data.apiToken;
  }

  return requestConfig;
};

export default addAuthHeader;
