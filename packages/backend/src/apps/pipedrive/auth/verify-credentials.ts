import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';
import getCurrentUser from '../common/get-current-user';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: $.auth.data.code as string,
    redirect_uri: redirectUri,
  });

  const headers = {
    Authorization: `Basic ${Buffer.from(
      $.auth.data.clientId + ':' + $.auth.data.clientSecret
    ).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const response = await $.http.post(
    `https://oauth.pipedrive.com/oauth/token`,
    params.toString(),
    { headers }
  );

  const {
    access_token: accessToken,
    api_domain: apiDomain,
    expires_in: expiresIn,
    refresh_token: refreshToken,
    scope: scope,
    token_type: tokenType,
  } = response.data;

  await $.auth.set({
    accessToken,
    apiDomain,
    expiresIn,
    refreshToken,
    scope,
    tokenType,
  });

  const user = await getCurrentUser($);

  const screenName = [user.name, user.company_domain]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    userId: user.id,
    screenName,
  });
};

export default verifyCredentials;
