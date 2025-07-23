const addAuthHeader = ($, requestConfig) => {
  requestConfig.headers.Authorization = `Bearer ${$.auth.data.accessToken}`;

  return requestConfig;
};

export default addAuthHeader;
