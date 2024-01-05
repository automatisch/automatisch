const verifyCredentials = async ($) => {
  await $.http.post('/', { topic: 'automatisch' });
  let screenName = $.auth.data.serverUrl;

  if ($.auth.data.username) {
    screenName = `${$.auth.data.username} @ ${screenName}`;
  }

  await $.auth.set({
    screenName,
  });
};

export default verifyCredentials;
