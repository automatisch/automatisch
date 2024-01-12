const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiToken) {
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.apiToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
