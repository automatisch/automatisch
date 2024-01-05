import { URLSearchParams } from 'url';

const refreshToken = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );

  const callbackUrl = oauthRedirectUrlField.value;

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    redirect_uri: callbackUrl,
    refresh_token: $.auth.data.refreshToken,
  });

  const { data } = await $.http.post('/oauth/v1/token', params.toString());

  await $.auth.set({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
  });
};

export default refreshToken;
