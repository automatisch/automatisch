import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const params = new URLSearchParams({
    code: $.auth.data.code as string,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const headers = {
    Authorization: `Basic ${Buffer.from(
      $.auth.data.clientId + ':' + $.auth.data.clientSecret
    ).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const response = await $.http.post(
    'https://accounts.spotify.com/api/token',
    params.toString(),
    { headers }
  );

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    scope: scope,
    token_type: tokenType,
  } = response.data;

  await $.auth.set({
    accessToken,
    refreshToken,
    expiresIn,
    scope,
    tokenType,
  });

  const user = await getCurrentUser($);

  await $.auth.set({
    userId: user.id,
    screenName: user.display_name,
  });
};

export default verifyCredentials;
