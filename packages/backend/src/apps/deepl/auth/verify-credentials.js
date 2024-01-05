const verifyCredentials = async ($) => {
  await $.http.get('/v2/usage');

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
