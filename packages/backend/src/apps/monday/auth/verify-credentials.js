const verifyCredentials = async ($) => {
  const body = {
    query: 'query { me { name, email } }',
  };

  const { data } = await $.http.post('/', body);

  const screenName = [data.data.me.name, data.data.me.email]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    screenName,
    apiToken: $.auth.data.apiToken,
  });
};

export default verifyCredentials;
