import { OAUTH_ENDPOINTS } from '../common/constants.js';
import getCurrentUser from '../common/get-current-user.js';
import { getOAuthRedirectUrl } from '../common/utils.js';

const verifyCredentials = async ($) => {
  const redirectUri = getOAuthRedirectUrl($);
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.consumerKey,
    redirect_uri: redirectUri,
    scope: 'all openid',
    code: $.auth.data.code,
    grant_type: 'authorization_code',
  });

  const response = await $.http.post(
    OAUTH_ENDPOINTS.GET_TOKEN,
    searchParams.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    }
  );

  const data = response.data;

  await $.auth.set({
    consumerKey: $.auth.data.consumerKey,
    consumerSecret: $.auth.data.consumerSecret,
    accessToken: data.access_token,
    scope: data.scope,
    tokenType: data.token_type,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    idToken: data.id_token,
  });

  const currentUser = await getCurrentUser($);

  await $.auth.set({
    screenName: `${currentUser.name} @ ${$.auth.data.site_url}`,
    userId: currentUser.name,
  });
};

export default verifyCredentials;
