import { IGlobalVariable } from '@automatisch/types';

const refreshToken = async ($: IGlobalVariable) => {
  const payload = {
    client_id: $.auth.data.clientId as string,
    client_secret: $.auth.data.clientSecret as string,
    refresh_token: $.auth.data.refreshToken as string,
    grant_type: 'refresh_token',
  };

  const { data } = await $.http.post(
    'https://sandbox.api.high-mobility.com/v1/access_tokens',
    payload
  );

  await $.auth.set({
    tokenType: data.token_type,
    status: data.status,
    scope: data.scope,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    accessToken: data.access_token,
    authorizationId: data.authorization_id,
  });
};

export default refreshToken;
