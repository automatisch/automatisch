const addAuthHeader = ($, requestConfig) => {
  if (
    !requestConfig.additionalProperties?.skipAddingAuthHeader &&
    $.auth.data?.accessToken
  ) {
    requestConfig.headers.Authorization = `${$.auth.data.tokenType} ${$.auth.data.accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
