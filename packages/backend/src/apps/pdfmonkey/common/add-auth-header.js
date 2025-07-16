const addAuthHeader = ($, requestConfig) => {
  requestConfig.headers.Authorization = `Bearer ${$.auth.data.apiKey}`;

  return requestConfig;
};

export default addAuthHeader;
