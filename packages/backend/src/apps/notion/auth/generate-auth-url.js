import { URL, URLSearchParams } from 'url';

export default async function generateAuthUrl($) {
  const oauthRedirectUrlField = $.app.auth.fields.find(
    (field) => field.key == 'oAuthRedirectUrl'
  );
  const redirectUri = oauthRedirectUrlField.value;
  const searchParams = new URLSearchParams({
    client_id: $.auth.data.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    owner: 'user',
  });

  const url = new URL(
    `/v1/oauth/authorize?${searchParams}`,
    $.app.apiBaseUrl
  ).toString();

  await $.auth.set({
    url,
  });
}
