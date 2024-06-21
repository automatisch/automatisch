const addAuthHeader = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingAuthHeader)
    return requestConfig;

  if ($.auth.data?.accessJwt) {
    requestConfig.headers.Authorization = `Bearer ${$.auth.data.accessJwt}`;
  }

  return requestConfig;
};

export default addAuthHeader;
