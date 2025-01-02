const verifyCredentials = async ($) => {
  await $.http.get('/costs?limit=2');

  await $.auth.set({
    screenName: $.auth.data.screenName,
    apiKey: $.auth.data.apiKey,
    amaLicense: $.auth.data.amaLicense,
  });
};

export default verifyCredentials;
