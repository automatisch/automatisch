const verifyCredentials = async ($) => {
  await $.http.get('/v2/metadata');

  await $.auth.set({
    screenName: $.auth.data.screenName,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
