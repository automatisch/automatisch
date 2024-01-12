const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.apiKey) {
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.apiKey}`;
    requestConfig.headers['carbone-version'] = '4';
  }

  return requestConfig;
};

export default addAuthHeader;
