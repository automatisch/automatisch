import { IField, IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';
import authScope from '../common/auth-scope';
import { URLSearchParams } from 'node:url';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;

  const params = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    scope: authScope.join(' '),
    code: $.auth.data.code as string,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    client_secret: $.auth.data.clientSecret as string,
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const { data } = await $.http.post(
    `https://login.microsoftonline.com/organizations/oauth2/v2.0/token`,
    params.toString(),
    { headers }
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
  });

  const currentUser = await getCurrentUser($);

  const screenName = [currentUser.displayName, $.auth.data.mail]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    clientId: $.auth.data.clientId,
    clientSecret: $.auth.data.clientSecret,
    scope: data.scope,
    expiresIn: data.expires_in,
    extExpiresIn: data.ext_expires_in,
    refreshToken: data.refresh_token,
    screenName,
  });
};

export default verifyCredentials;
