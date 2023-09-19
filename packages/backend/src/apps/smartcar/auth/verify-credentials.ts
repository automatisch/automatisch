import { IGlobalVariable, IField } from '@automatisch/types';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($: IGlobalVariable) => {
  const token = Buffer.from(
    `${$.auth.data.clientId}:${$.auth.data.clientSecret}`
  ).toString('base64');

  const headers = {
    Authorization: `Basic ${token}`,
  };

  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: $.auth.data.code as string,
    redirect_uri: redirectUri,
  });

  const response = await $.http.post(
    `https://auth.smartcar.com/oauth/token`,
    params.toString(),
    { headers }
  );

  const responseData = Object.fromEntries(new URLSearchParams(response.data));

  await $.auth.set({
    accessToken: responseData.access_token,
    tokenType: responseData.token_type,
    expiresIn: responseData.expires_in,
    refreshToken: responseData.refresh_token,
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
