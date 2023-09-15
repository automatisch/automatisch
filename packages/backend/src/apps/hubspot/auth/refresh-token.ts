import { IGlobalVariable, IField } from '@automatisch/types';
import { URLSearchParams } from 'url';

const refreshToken = async ($: IGlobalVariable) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field: IField) => field.key == 'oAuthRedirectUrl'
  );

  const callbackUrl = oauthRedirectUrlField.value as string;

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: $.auth.data.clientId as string,
    client_secret: $.auth.data.clientSecret as string,
    redirect_uri: callbackUrl,
    refresh_token: $.auth.data.refreshToken as string,
  });

  const { data } = await $.http.post('/oauth/v1/token', params.toString());

  await $.auth.set({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
  });
};

export default refreshToken;
