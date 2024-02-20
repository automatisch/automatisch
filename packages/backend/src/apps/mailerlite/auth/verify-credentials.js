const verifyCredentials = async ($) => {
  await $.http.get('/campaigns');

  await $.auth.set({
    screenName: $.auth.data.screenName,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
