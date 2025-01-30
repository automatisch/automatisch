const addContentTypeHeader = ($, requestConfig) => {
  requestConfig.headers.accept = 'application/json';

  return requestConfig;
};

export default addContentTypeHeader;
