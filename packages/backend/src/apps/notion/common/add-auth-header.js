const addAuthHeader = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingAuthHeader)
    return requestConfig;

  if ($.auth.data?.integrationToken) {
    const authorizationHeader = `Bearer ${$.auth.data.integrationToken}`;
    requestConfig.headers.Authorization = authorizationHeader;
  }

  return requestConfig;
};

export default addAuthHeader;
