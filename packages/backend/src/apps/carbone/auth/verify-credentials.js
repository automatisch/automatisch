const verifyCredentials = async ($) => {
  await $.http.get('/templates');

  await $.auth.set({
    screenName: $.auth.data.screenName,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
