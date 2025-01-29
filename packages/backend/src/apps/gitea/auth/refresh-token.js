import { URLSearchParams } from 'node:url';

const refreshToken = async ($) => {
  const params = new URLSearchParams({
    client_id: $.auth.data.clientId,
    client_secret: $.auth.data.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: $.auth.data.refreshToken,
  });

  const { data } = await $.http.post(
    `${$.auth.data.instanceUrl}/login/oauth/access_token`,
    params.toString(),
    {
      additionalProperties: {
        skipAddingBaseUrl: true,
      },
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
    refreshToken: data.refresh_token,
  });
};

export default refreshToken;
