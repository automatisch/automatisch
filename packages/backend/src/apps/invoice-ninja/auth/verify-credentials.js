const verifyCredentials = async ($) => {
  const { data } = await $.http.get('/v1/ping');

  const screenName = [data.user_name, data.company_name]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    screenName,
  });
};

export default verifyCredentials;
