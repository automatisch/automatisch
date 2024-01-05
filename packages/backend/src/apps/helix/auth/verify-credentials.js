const verifyCredentials = async ($) => {
  await $.http.get('/api/v1/sessions');

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
