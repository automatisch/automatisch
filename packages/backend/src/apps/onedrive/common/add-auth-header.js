const addAuthHeader = ($, requestConfig) => {
  const login = $.auth.data.login;
  const password = $.auth.data.password;

  if (login && password) {
    requestConfig.auth = {
      username: login,
      password,
    };
  }

  requestConfig.headers['OCS-APIRequest'] = true;

  return requestConfig;
};

export default addAuthHeader;
