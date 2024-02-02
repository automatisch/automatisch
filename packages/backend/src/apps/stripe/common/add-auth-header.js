const addAuthHeader = ($, requestConfig) => {
  requestConfig.headers['Authorization'] = `Bearer ${$.auth.data?.secretKey}`;
  return requestConfig;
};

export default addAuthHeader;
