import { IField, IGlobalVariable } from '@automatisch/types';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrl = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  ).value;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: $.auth.data.code as string,
    client_id: $.auth.data.clientId as string,
    client_secret: $.auth.data.clientSecret as string,
    redirect_uri: oauthRedirectUrl as string,
  });

  const { data: verifiedCredentials } = await $.http.post(
    '/oauth/token',
    params.toString()
  );

  const {
    access_token: accessToken,
    expires_in: expiresIn,
    token_type: tokenType,
    refresh_token: refreshToken,
  } = verifiedCredentials;

  const { data: user } = await $.http.get('/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  await $.auth.set({
    accessToken,
    expiresIn,
    tokenType,
    userId: user.user_id,
    screenName: user.alias,
    email: user.email,
    refreshToken,
  });
};

export default verifyCredentials;
