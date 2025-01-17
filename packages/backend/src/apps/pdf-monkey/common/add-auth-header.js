const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiKey) {
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.apiKey}`;
  }

  return requestConfig;
};

export default addAuthHeader;
