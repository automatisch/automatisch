import getCurrentUser from '../common/get-current-user.js';

const verifyCredentials = async ($) => {
    const siteUrl = $.auth.data.site_url;
    const oauthRedirectUrlField = $.app.auth.fields.find(
      (field) => field.key === 'oAuthRedirectUrl'
    );
    const redirectUri = oauthRedirectUrlField.value;
    const searchParams = new URLSearchParams({
      client_id: $.auth.data.consumerKey,
      redirect_uri: redirectUri,
      scope: "all openid",
      code: $.auth.data.code,
      grant_type: "authorization_code",
    });
    
    const response = await $.http.post(
    `${siteUrl}/api/method/frappe.integrations.oauth2.get_token`,
    searchParams.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    }
  );

  const data = response.data;
  $.auth.data.accessToken = data.access_token;
  const currentUser = await getCurrentUser($);
    
  await $.auth.set({
    screenName: `${currentUser.name} @ ${$.auth.data.site_url}`,
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