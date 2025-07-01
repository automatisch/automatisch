import { OAUTH_ENDPOINTS } from '../common/constants.js';
import { getOAuthRedirectUrl } from '../common/utils.js';

const refreshToken = async ($) => {
  const redirectUri = getOAuthRedirectUrl($);
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.consumerKey,
    client_secret: $.auth.data.consumerSecret,
    redirect_uri: redirectUri,
    scope: 'all openid',
    refresh_token: $.auth.data.refreshToken,
    grant_type: 'refresh_token',
  });

  const { data } = await $.http.post(
    OAUTH_ENDPOINTS.GET_TOKEN,
    searchParams.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      additionalProperties: {
        skipAddingAuthHeader: true,
      },
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
  });
};

export default refreshToken;
