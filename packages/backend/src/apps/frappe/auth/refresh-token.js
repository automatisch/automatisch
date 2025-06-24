const refreshToken = async ($) => {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key === 'oAuthRedirectUrl'
  );

  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.consumerKey,
    client_secret: $.auth.data.consumerSecret,
    redirect_uri: redirectUri,
    scope: "all openid",
    refresh_token: $.auth.data.refreshToken,
    grant_type: "refresh_token",
  });

  const siteUrl = $.auth.data.site_url;
  const { data } = await $.http.post(
    `${siteUrl}/api/method/frappe.integrations.oauth2.get_token`,
    searchParams.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }
    }
  );

  await $.auth.set({
    accessToken: data.access_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token 
  });
};

export default refreshToken;