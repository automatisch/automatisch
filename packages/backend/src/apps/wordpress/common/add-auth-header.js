const addAuthHeader = ($, requestConfig) => {
  const userLogin = $.auth.data.userLogin;
  const password = $.auth.data.password;

  if (userLogin && password) {
    requestConfig.auth = {
      username: userLogin,
      password,
    };
  }

  return requestConfig;
};

export default addAuthHeader;
