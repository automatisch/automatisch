const verifyCredentials = async ($) => {
  await $.http.get('/v1/sessions');

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
