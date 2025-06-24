const refreshToken = async ($) => {
    const oauthRedirectUrlField = $.app.auth.fields.find(
      (field) => field.key === 'oAuthRedirectUrl'
    );
    const redirectUri = oauthRedirectUrlField.value;
    const searchParams = new URLSearchParams({
      client_id: $.auth.data.consumerKey,
      redirect_uri: redirectUri,
      scope: "all openid",
      refresh_token: $.auth.data.refreshToken,
      grant_type: "authorization_code",
    });
    

  const siteUrl = $.auth.data.site_url;
  const { data } = await $.http.post(
    `${siteUrl}/api/method/frappe.integrations.oauth2.get_token?${searchParams}`
  );

  await $.auth.set({
    accessToken: data.access_token,
    tokenType: data.token_type,
    idToken: data.id_token,
  });
};

export default refreshToken;