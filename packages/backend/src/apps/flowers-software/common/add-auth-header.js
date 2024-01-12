const addAuthHeader = ($, requestConfig) => {
  const { data } = $.auth;

  if (data?.username && data.password && data.apiKey) {
    requestConfig.headers['x-api-key'] = data.apiKey;

    requestConfig.auth = {
      username: data.username,
      password: data.password,
    };
  }

  return requestConfig;
};

export default addAuthHeader;
