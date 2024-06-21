const verifyCredentials = async ($) => {
  await $.http.get('/v1/systeminfo');

  await $.auth.set({
    screenName: $.auth.data.screenName,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
