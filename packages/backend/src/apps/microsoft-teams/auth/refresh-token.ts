import { URLSearchParams } from 'node:url';
import { IGlobalVariable } from '@automatisch/types';
import authScope from '../common/auth-scope';

const refreshToken = async ($: IGlobalVariable) => {
  const params = new URLSearchParams({
    client_id: $.auth.data.clientId as string,
    client_secret: $.auth.data.clientSecret as string,
    grant_type: 'refresh_token',
    refresh_token: $.auth.data.refreshToken as string,
  });

  const { data } = await $.http.post(
    'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
    params.toString()
  );

  await $.auth.set({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    scope: authScope.join(' '),
    tokenType: data.token_type,
    refreshToken: data.refresh_token,
  });
};

export default refreshToken;
