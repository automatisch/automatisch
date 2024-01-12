import { URLSearchParams } from 'url';

export default async function generateAuthUrl($) {
  const scopes = ['read:org', 'repo', 'user'];
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.consumerKey,
    redirect_uri: redirectUri,
    scope: scopes.join(','),
  });

  const url = `${
    $.app.baseUrl
  }/login/oauth/authorize?${searchParams.toString()}`;

  await $.auth.set({
    url,
  });
}
