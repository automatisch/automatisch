import { IField, IGlobalVariable } from '@automatisch/types';
import getCurrentUser from '../common/get-current-user';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;
  const headers = {
    Authorization: `Basic ${Buffer.from(
      $.auth.data.clientId + ':' + $.auth.data.clientSecret
    ).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: $.auth.data.code as string,
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
