const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.accessToken) {
    requestConfig.headers.Authorization = `Zoho-oauthtoken ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
