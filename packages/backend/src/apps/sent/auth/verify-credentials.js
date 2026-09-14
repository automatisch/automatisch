const buildScreenName = (account) => {
  const name = account?.name?.trim();
  const email = account?.email?.trim();

  if (name && email) return `${name} - ${email}`;

  return name || email || 'Sent account';
};

const verifyCredentials = async ($) => {
  const response = await $.http.get('/v3/me');
  const account = response.data?.data;

  await $.auth.set({
    screenName: buildScreenName(account),
  });
};

export default verifyCredentials;
