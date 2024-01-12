import getCurrentUser from '../common/get-current-user.js';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const headers = {
    Authorization: `Basic ${Buffer.from(
      $.auth.data.clientId + ':' + $.auth.data.clientSecret
    ).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: $.auth.data.code,
    redirect_uri: redirectUri,
  });

  const { data } = await $.http.post(
    'https://identity.xero.com/connect/token',
    params.toString(),
    {
      headers,
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
    idToken: data.id_token,
  });

  const currentUser = await getCurrentUser($);

  const screenName = [currentUser.tenantName, currentUser.tenantType]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: $.auth.data.scope,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
    tenantId: currentUser.tenantId,
    screenName,
  });
};

export default verifyCredentials;
