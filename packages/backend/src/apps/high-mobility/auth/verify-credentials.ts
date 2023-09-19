import { IGlobalVariable, IField } from '@automatisch/types';
import { URLSearchParams } from 'url';

const verifyCredentials = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value as string;

  const payload = {
    client_id: $.auth.data.clientId as string,
    client_secret: $.auth.data.clientSecret as string,
    code: $.auth.data.code as string,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };

  const response = await $.http.post(
    'https://sandbox.api.high-mobility.com/v1/access_tokens',
    payload
  );

  const responseData = Object.fromEntries(new URLSearchParams(response.data));

  await $.auth.set({
    tokenType: responseData.token_type,
    status: responseData.status,
    scope: responseData.scope,
    refreshToken: responseData.refresh_token,
    expiresIn: responseData.expires_in,
    accessToken: responseData.access_token,
    authorizationId: responseData.authorization_id,
  });
};

export default verifyCredentials;
