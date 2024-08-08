const verifyCredentials = async ($) => {
  const handle = $.auth.data.handle;
  const password = $.auth.data.password;

  const body = {
    identifier: handle,
    password,
  };

  const { data } = await $.http.post('/com.atproto.server.createSession', body);

  await $.auth.set({
    accessJwt: data.accessJwt,
    refreshJwt: data.refreshJwt,
    did: data.did,
    screenName: data.handle,
  });
};

export default verifyCredentials;
