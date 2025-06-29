import { OAUTH_ENDPOINTS } from '../common/constants.js';
import getCurrentUser from '../common/get-current-user.js';
import { getFrappeSiteURL, getOAuthRedirectUrl } from '../common/utils.js';

const verifyCredentials = async ($) => {
    const redirectUri = getOAuthRedirectUrl($);
    const searchParams = new URLSearchParams({
      client_id: $.auth.data.consumerKey,
      redirect_uri: redirectUri,
      scope: "all openid",
      code: $.auth.data.code,
      grant_type: "authorization_code",
    });
    
    const response = await $.http.post(
      OAUTH_ENDPOINTS.GET_TOKEN, searchParams.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }
    );

  const data = response.data;
  $.auth.data.accessToken = data.access_token;
  const siteUrl = getFrappeSiteURL($);
  const currentUser = await getCurrentUser($);
    
  await $.auth.set({
    screenName: `${currentUser.name} @ ${siteUrl}`,
    consumerKey: $.auth.data.consumerKey,
    consumerSecret: $.auth.data.consumerSecret,
    accessToken: data.access_token,
    scope: data.scope,
    tokenType: data.token_type,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    userId: currentUser.name,
    idToken: data.id_token
  });
  
};

export default verifyCredentials;