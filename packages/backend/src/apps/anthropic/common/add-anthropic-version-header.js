const addAuthHeader = ($, requestConfig) => {
  requestConfig.headers['anthropic-version'] = '2023-06-01';

  return requestConfig;
};

export default addAuthHeader;
