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
  });

  const instanceUrl = $.auth.data.instanceUrl;

  const url = new URL(
    `/oauth/authorize?${searchParams.toString()}`,
    instanceUrl
  );

  await $.auth.set({
    url,
  });
}
