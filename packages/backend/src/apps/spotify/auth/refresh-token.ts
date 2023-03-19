import { IGlobalVariable } from '@automatisch/types';
import qs from 'qs';

const refreshToken = async ($: IGlobalVariable) => {
  const stringifiedBody = qs.stringify({
    refresh_token: $.auth.data.refreshToken as string,
    grant_type: 'refresh_token',
  });

  const headers = {
    Authorization: `Basic ${Buffer.from(
      $.auth.data.clientId + ':' + $.auth.data.clientSecret
    ).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const response = await $.http.post(
    'https://accounts.spotify.com/api/token',
    stringifiedBody,
    { headers }
  );

  await $.auth.set({
    accessToken: response.data.access_token,
    expiresIn: response.data.expires_in,
    tokenType: response.data.token_type,
  });
};

export default refreshToken;
