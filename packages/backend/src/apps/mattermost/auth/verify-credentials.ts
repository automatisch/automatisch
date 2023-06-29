import { IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const params = {
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    code: $.auth.data.code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  };
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded', // This is not documented yet required
  };
  const response = await $.http.post('/oauth/access_token', null, {
    params,
    headers,
  });

  const {
    data: { access_token, refresh_token, scope, token_type },
  } = response;

  $.auth.data.accessToken = response.data.access_token;

  const currentUser = await getCurrentUser($);

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    accessToken: access_token,
    refreshToken: refresh_token,
    scope: scope,
    tokenType: token_type,
    userId: currentUser.id,
    screenName: currentUser.username,
  });
};

export default verifyCredentials;
