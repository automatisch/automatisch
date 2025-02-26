const verifyCredentials = async ($) => {
  const instanceUrl = $.auth.data.instanceUrl;
  const password = $.auth.data.password;
  const login = $.auth.data.login;

  await $.http.get('/ocs/v1.php/cloud/capabilities');

  await $.auth.set({
    screenName: $.auth.data.screenName,
    instanceUrl,
    username: `${login}`,
    password: `${password}`,
  });
};

export default verifyCredentials;
