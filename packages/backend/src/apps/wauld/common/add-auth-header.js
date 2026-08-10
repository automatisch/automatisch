const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.accessToken) {
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.accessToken}`;
  }

  requestConfig.headers['Connect-Protocol-Version'] = '1';
  requestConfig.headers['Content-Type'] = 'application/json';

  return requestConfig;
};

export default addAuthHeader;