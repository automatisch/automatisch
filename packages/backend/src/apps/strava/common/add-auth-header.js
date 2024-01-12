const addAuthHeader = ($, requestConfig) => {
  const { accessToken, tokenType } = $.auth.data;

  if (accessToken && tokenType) {
    requestConfig.headers.Authorization = `${tokenType} ${accessToken}`;
  }

  return requestConfig;
};

export default addAuthHeader;
