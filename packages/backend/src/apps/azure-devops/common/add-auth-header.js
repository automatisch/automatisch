const addAuthHeader = ($, requestConfig) => {
  const { userEmail, personalAccessToken } = $.auth.data;
  if (userEmail && personalAccessToken) {
    const authorizationHeader = `Basic ${Buffer.from(`${userEmail}:${personalAccessToken}`).toString('base64')}`;
    requestConfig.headers.Authorization = authorizationHeader;
  }

  return requestConfig;
};

export default addAuthHeader;
