const addAuthHeader = ($, requestConfig) => {
  requestConfig.headers.Authorization = `${$.auth.data.tokenType} ${$.auth.data.accessToken}`;

  return requestConfig;
};

export default addAuthHeader;
