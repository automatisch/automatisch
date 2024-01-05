const verifyCredentials = async ($) => {
  const { data } = await $.http.get('/getMe');
  const { result: me } = data;

  await $.auth.set({
    screenName: me.first_name,
  });
};

export default verifyCredentials;
