const refreshToken = async ($) => {
  const { refreshJwt } = $.auth.data;

  const { data } = await $.http.post(
    '/com.atproto.server.refreshSession',
    null,
    {
      headers: {
        Authorization: `Bearer ${refreshJwt}`,
      },
      additionalProperties: {
        skipAddingAuthHeader: true,
      },
    }
  );

  await $.auth.set({
    accessJwt: data.accessJwt,
    refreshJwt: data.refreshJwt,
    did: data.did,
  });
};

export default refreshToken;
