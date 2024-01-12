const verifyCredentials = async ($) => {
  const params = {
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    code: $.auth.data.code,
    grant_type: 'authorization_code',
  };
  const { data } = await $.http.post('/v3/oauth/token', null, { params });

  await $.auth.set({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
    athleteId: data.athlete.id,
    screenName: `${data.athlete.firstname} ${data.athlete.lastname}`,
  });
};

export default verifyCredentials;
