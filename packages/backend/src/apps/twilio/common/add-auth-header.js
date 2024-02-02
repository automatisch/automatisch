const addAuthHeader = ($, requestConfig) => {
  if (
    requestConfig.headers &&
    $.auth.data?.accountSid &&
    $.auth.data?.authToken
  ) {
    requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    requestConfig.auth = {
      username: $.auth.data.accountSid,
      password: $.auth.data.authToken,
    };
  }

  return requestConfig;
};

export default addAuthHeader;
