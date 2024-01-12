const refreshToken = async ($) => {
  const params = {
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: $.auth.data.refreshToken,
  };

  const { data } = await $.http.post('/v3/oauth/token', null, { params });

  await $.auth.set({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    expiresAt: data.expires_at,
    tokenType: data.token_type,
    refreshToken: data.refresh_token,
  });
};

export default refreshToken;
