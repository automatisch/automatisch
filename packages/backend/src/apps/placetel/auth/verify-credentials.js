const verifyCredentials = async ($) => {
  const { data } = await $.http.get('/v2/me');

  await $.auth.set({
    screenName: `${data.name} @ ${data.company}`,
  });
};

export default verifyCredentials;
