import { Buffer } from 'node:buffer';

const refreshToken = async ($) => {
  const response = await $.http.post(
    'https://accounts.spotify.com/api/token',
    null,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          $.auth.data.clientId + ':' + $.auth.data.clientSecret
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        refresh_token: $.auth.data.refreshToken,
        grant_type: 'refresh_token',
      },
      additionalProperties: {
        skipAddingAuthHeader: true,
      },
    }
  );

  await $.auth.set({
    accessToken: response.data.access_token,
    expiresIn: response.data.expires_in,
    tokenType: response.data.token_type,
  });
};

export default refreshToken;
