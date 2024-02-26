const addAuthHeader = ($, requestConfig) => {
  const { data } = $.auth;

  if (data?.username && data?.accessKey) {
    requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    requestConfig.auth = {
      username: data.username,
      password: data.accessKey,
    };
  }

  return requestConfig;
};

export default addAuthHeader;
