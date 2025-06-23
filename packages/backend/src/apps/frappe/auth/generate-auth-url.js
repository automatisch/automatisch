import { URLSearchParams } from 'url';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.consumerKey,
    redirect_uri: redirectUri,
    scope: "all openid",
    response_type: 'code',
  });

  const url = `${
    $.auth.data.site_url
  }/api/method/frappe.integrations.oauth2.authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
