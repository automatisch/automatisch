const verifyCredentials = async ($) => {
  await $.http.get('/balance');

  await $.auth.set({
    screenName: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
