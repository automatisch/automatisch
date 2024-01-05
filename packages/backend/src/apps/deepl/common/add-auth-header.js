const addAuthHeader = ($, requestConfig) => {
  if ($.auth.data?.authenticationKey) {
    const authorizationHeader = `DeepL-Auth-Key ${$.auth.data.authenticationKey}`;
    requestConfig.headers.Authorization = authorizationHeader;
  }

  return requestConfig;
};

export default addAuthHeader;
