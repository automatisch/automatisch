const verifyCredentials = async ($) => {
  const body = {
    q: 'Hi!',
  };

  await $.http.post('/detect', body);

  await $.auth.set({
    screenName: $.auth.data.screenName,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
