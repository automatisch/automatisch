const addAuthToken = ($, requestConfig) => {
  if (requestConfig.additionalProperties?.skipAddingAuthToken)
    return requestConfig;

  requestConfig.url = requestConfig.url + `?key=${$.auth.data.authToken}`;

  return requestConfig;
};

export default addAuthToken;
