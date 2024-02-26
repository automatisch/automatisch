const addAuthHeader = ($, requestConfig) => {
  if (
    !requestConfig.additionalProperties?.skipAddingAuthHeader &&
    $.auth.data?.accessToken
  ) {
    requestConfig.headers['Content-Type'] = 'application/json';

    requestConfig.headers.Authorization = `Bearer ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
