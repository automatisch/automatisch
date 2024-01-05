const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.accessToken) {
    const authorizationHeader = `Bearer ${$.auth.data.accessToken}`;
    requestConfig.headers.Authorization = authorizationHeader;
  }

  return requestConfig;
};

export default addAuthHeader;
