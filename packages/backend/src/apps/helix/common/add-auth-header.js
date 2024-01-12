const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiKey) {
    const authorizationHeader = `Bearer ${$.auth.data.apiKey}`;
    requestConfig.headers.Authorization = authorizationHeader;
  }

  return requestConfig;
};

export default addAuthHeader;
